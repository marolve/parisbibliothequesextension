
var counter = 0;
var lastUrl = '';

callSpy(true);

navigation.addEventListener("navigate", (e) => { 
	console.log('navigate');
	callSpy(true);
})

function callSpy(init) {
	console.log('spy ' + init);
	if (init) {
		counter = 0;
		lastUrl = window.location.href;
	}
	setTimeout( spy, 500);
}

function spy() {
	if (lastUrl.indexOf(window.location.href) != 0) {
	  callSpy(true);
	} else {
		counter++;
		if (document.getElementById('btnbibtomap') == null) {
			var place = document.querySelector('.more-actions div');
			if (place) {
				const btn = document.createElement("button");
				btn.textContent = 'Map';
				btn.id = "btnbibtomap";
				btn.title = "Ouvrir dans une carte";
				btn.classList.add('btn');
				place.parentNode.insertBefore(btn, place);
				
				btn.addEventListener('click', ()=> {
					openMap();
				});
			}
		}
		if (document.getElementById('btnbibtomapmobile') == null) {
			var place = document.querySelector('.more-actions-mobile a');
			if (place) {
				const btn = document.createElement("button");
				btn.textContent = 'Map';
				btn.id = "btnbibtomapmobile";
				btn.title = "Ouvrir dans une carte";
				btn.classList.add('btn');
				place.parentNode.insertBefore(btn, place);
				
				btn.addEventListener('click', ()=> {
					openMap();
				});
			}
		}
		if (counter < 20) {
			callSpy(false);
		}
	}
}

function openMap() {
	
	const curDate = new Date();
  const items = document.querySelectorAll('.holdings_container_desktop tbody tr');
	console.log(items.length);
	encodeStr = '';
	for (var i = 0; i < items.length; i++) {
		const item = items[i];
		var bibNameCode = '';
		var bibStatus = '';
		var nbDays = 0;
		// days36 en système à base 36 sur deux lettres 36x36=1296 milieu /2=648 (en rayon=647, indisponible=646)
		var days36 = '';
		for (const child of item.children) {
			if (child.nodeName == 'TD') {
				if (child.children && child.children.length == 1) {
					if (child.children[0].nodeName == 'A') {
						bibNameCode = child.children[0].innerHTML;
					}
				} else {
					if (child.innerHTML) {
						if (child.innerHTML.indexOf('En rayon') == 0) {
							bibStatus = 'OK';
							days36 = (647).toString(36);
						}
						if (child.innerHTML.indexOf('Indisponible') == 0) {
							bibStatus = -2;
							days36 = (646).toString(36);
						}
						if (child.innerHTML.indexOf('Retour prévu le ') == 0) {
							const dayReturn = parseInt(child.innerHTML.substr(16, 2));
							const monthReturn = parseInt(child.innerHTML.substr(19, 2));
							const yearReturn = parseInt(child.innerHTML.substr(22, 4));
							bibStatus = child.innerHTML.substr(16,10);
							var dateReturn = new Date(yearReturn, monthReturn-1, dayReturn, curDate.getHours(), curDate.getMinutes(), curDate.getSeconds(), curDate.getMilliseconds());
							nbDays = Math.floor((dateReturn - curDate)/ (1000*60*60*24));
							days36 = (nbDays + 648).toString(36);
						}
					}	
				}
			}
		}
		var bibCode = '';
		for (var j = 0; j < bibliotheques.length; j++) {
			const bibliotheque = bibliotheques[j];
			if (bibNameCode.indexOf(bibliotheque.namecode) != -1) {
				bibCode = bibliotheque.code;
				break;
			}
		}
		if (bibCode.length == 2) {
			encodeStr += bibCode + days36;
		} else {
			console.error('Error Bibliotheque not found : ' + bibNameCode);
		}
		//console.log("bib " + (i+1) + ': ' + bibNameCode + ' -> ' + bibStatus + ' = ' + nbDays + ' (' + days36 + ')');
	}
	console.log(encodeStr);
	
	var curDateStr = curDate.toISOString();
	var urlData = curDateStr.substr(0,4) + curDateStr.substr(5,2) + curDateStr.substr(8,2);
	urlData += encodeStr;
	
	var titleElt = document.querySelector('#notice_longue_description h2');
	console.log(titleElt);
	if (titleElt != null) {
		urlData += '_' + encodeURIComponent(titleElt.innerHTML);
	}
	
	window.open('http://localplace.free.fr/bibliotheques.html#' + urlData, '_blank');
}

// spec (bibliothèque spécialisée) 0=non 1=oui 2=inconnu
var bibliotheques = [
{ spec: 0, name: 'Médiathèque de la Canopée', namecode:'La Canopée', code:'CP', x: 48.8624488, y: 2.3468200 },
{ spec: 1, name: 'Bibliothèque du cinéma François Truffaut', namecode:'75XXX', code:'FT', x: 48.8624222, y: 2.3447374 },
{ spec: 0, name: 'Médiathèque musicale de Paris – Christiane Eda-Pierre', namecode:'Médiathèque Musicale', code:'EP', x: 48.86271, y: 2.3458 },
{ spec: 0, name: 'Bibliothèque Charlotte Delbo', namecode:'Charlotte Delbo', code:'DL', x: 48.8665219, y: 2.3404139 },
{ spec: 0, name: 'Bibliothèque Marguerite Audoux', namecode:'Marguerite Audoux', code:'AD', x: 48.8637097, y: 2.3601006 },
{ spec: 2, name: 'Bibliothèque de l\'Hôtel de Ville (BHdV)', namecode:'75XXX', code:'HV', x: 48.8567195, y: 2.3532017 },
{ spec: 1, name: 'Bibliothèque Forney', namecode:'75XXX', code:'FY', x: 48.8534078, y: 2.3591424 },
{ spec: 0, name: 'Bibliothèque Arthur Rimbaud', namecode:'Arthur Rimbaud', code:'RB', x: 48.8560527, y: 2.3563220 },
{ spec: 1, name: 'Bibliothèque historique de la Ville de Paris (BHVP)', namecode:'75XXX', code:'HP', x: 48.85687, y: 2.36198 },
{ spec: 0, name: 'Bibliothèque Mohammed Arkoun', namecode:'Mohammed Arkoun', code:'AK', x: 48.8424593, y: 2.3496593 },
{ spec: 0, name: 'Bibliothèque Buffon', namecode:'Buffon', code:'BU', x: 48.8425359, y: 2.3619057 },
{ spec: 1, name: 'Bibliothèque des littératures policières (BiLiPo)', namecode:'75XXX', code:'LP', x: 48.8465706, y: 2.3512935 },
{ spec: 0, name: 'Bibliothèque L\'Heure joyeuse', namecode:'L\'Heure Joyeuse', code:'HJ', x: 48.8519721, y: 2.3449774 },
{ spec: 0, name: 'Bibliothèque Rainer Maria Rilke', namecode:'Rainer Maria Rilke', code:'RK', x: 48.8394, y: 2.33885 },
{ spec: 0, name: 'Bibliothèque André Malraux', namecode:'André Malraux', code:'ML', x: 48.8479961, y: 2.3275248 },
{ spec: 0, name: 'Bibliothèque Amélie', namecode:'Amélie', code:'AM', x: 48.8580602, y: 2.3089956 },
{ spec: 0, name: 'Bibliothèque Saint-Simon', namecode:'Saint-Simon', code:'SS', x: 48.85691, y: 2.32009 },
{ spec: 0, name: 'Bibliothèque Jean d\'Ormesson (ex-Europe)', namecode:'Jean d\'Ormesson', code:'OR', x: 48.8777273, y: 2.3175191 },
{ spec: 0, name: 'Bibliothèque Agustina Bessa-Luís (ex Courcelles)', namecode:'Agustina Bessa-Luis', code:'BL', x: 48.8780917, y: 2.3027106 },
{ spec: 0, name: 'Bibliothèque Louise Walser-Gaillard', namecode:'Louise Walser-Gaillard', code:'WG', x: 48.88151, y: 2.33244 },
{ spec: 0, name: 'Bibliothèque Valeyre', namecode:'Valeyre', code:'VY', x: 48.8779906, y: 2.3450959 },
{ spec: 0, name: 'Bibliothèque Drouot', namecode:'Drouot', code:'DO', x: 48.8733857, y: 2.3404264 },
{ spec: 1, name: 'Fonds Patrimonial Heure Joyeuse', namecode:'75XXX', code:'PH', x: 48.87568, y: 2.35378 },
{ spec: 0, name: 'Médiathèque Françoise Sagan', namecode:'Françoise Sagan', code:'FS', x: 48.87557, y: 2.35375  },
{ spec: 0, name: 'Bibliothèque Claire Bretécher (ex-Lancry)', namecode:'Claire Bretécher', code:'CB', x: 48.8695100, y: 2.3602240 },
{ spec: 0, name: 'Bibliothèque François Villon', namecode:'François Villon', code:'VI', x: 48.8772247, y: 2.3706998 },
{ spec: 0, name: 'Bibliothèque Toni Morrison - Parmentier', namecode:'Toni Morrison', code:'TM', x: 48.8602360, y: 2.3791681 },
{ spec: 0, name: 'Médiathèque Violette Leduc', namecode:'Violette Leduc', code:'VL', x: 48.8515628, y: 2.3840327 },
{ spec: 0, name: 'Bibliothèque Saint-Eloi', namecode:'Saint-Eloi', code:'SE', x:  48.8454696, y: 2.3871278 },
{ spec: 1, name: 'Bibliothèque de la Maison Paris Nature', namecode:'75XXX', code:'PN', x: 48.8396, y: 2.44158 },
{ spec: 0, name: 'Bibliothèque Jeunesse Diderot', namecode:'Diderot', code:'DI', x:  48.8459092, y: 2.3777264 },
{ spec: 2, name: 'Bibliothèque de l\'Ecole Du Breuil', namecode:'75XXX', code:'EB', x: 48.8239291, y: 2.4591392 },
{ spec: 0, name: 'Médiathèque Hélène Berr', namecode:'Hélène Berr', code:'HB', x: 48.84251, y: 2.39738 },
{ spec: 2, name: 'Bibliothèque de la maison du jardinage et du compostage', namecode:'75XXX', code:'JC', x: 48.83561 , y: 2.38222 },
{ spec: 2, name: 'Bibliothèque de l\'Ecole Estienne', namecode:'75XXX', code:'ES', x: 48.83105 , y: 2.35206 },
{ spec: 0, name: 'Bibliothèque Italie', namecode:'Italie', code:'IT', x: 48.8308701, y: 2.3570791 },
{ spec: 0, name: 'Médiathèque Jean-Pierre Melville', namecode:'Jean-Pierre Melville', code:'JP', x: 48.8267459, y: 2.3664051 },
{ spec: 2, name: 'Bibliothèque Marguerite Durand (BMD)', namecode:'75XXX', code:'DD', x: 48.8267781, y: 2.3663163 },
{ spec: 0, name: 'Médiathèque Virginia Woolf', namecode:'Virginia Woolf', code:'VW', x: 48.8173717, y: 2.359075 },
{ spec: 0, name: 'Bibliothèque Glacière - Marina Tsvetaïeva', namecode:'Marina Tsvetaïeva', code:'TS', x: 48.8273570, y: 2.3419023 },
{ spec: 0, name: 'Bibliothèque Georges Brassens', namecode:'Georges Brassens', code:'GB', x: 48.83379, y: 2.32576 },
{ spec: 0, name: 'Bibliothèque Benoîte Groult', namecode:'Benoîte Groult', code:'BG', x: 48.8382460, y: 2.3199849 },
{ spec: 0, name: 'Bibliothèque Aimé Césaire', namecode:'Aimé Césaire', code:'AC', x: 48.8312882, y: 2.3115582 },
{ spec: 0, name: 'Médiathèque Marguerite Yourcenar', namecode:'Marguerite Yourcenar', code:'MY', x: 48.8369, y: 2.30362 },
{ spec: 0, name: 'Bibliothèque Vaugirard', namecode:'75015 - Vaugirard', code:'VD', x: 48.8417871, y: 2.2993261 },
{ spec: 0, name: 'Bibliothèque Andrée Chedid', namecode:'Andrée Chedid', code:'CH', x: 48.8500551, y: 2.2863669 },
{ spec: 0, name: 'Bibliothèque Gutenberg', namecode:'Gutenberg', code:'GU', x: 48.84012, y: 2.27877 },
{ spec: 0, name: 'Bibliothèque Musset', namecode:'Musset', code:'MT', x: 48.8421613, y: 2.2631956 },
{ spec: 0, name: 'Bibliothèque Germaine Tillion', namecode:'Germaine Tillion', code:'GT', x:  48.8619235, y: 2.2845474 },
{ spec: 2, name: 'Bibliothèque du tourisme et des voyages - Germaine Tillion (BTV)', namecode:'75XXX', code:'TV', x: 48.86191, y: 2.28465 },
{ spec: 0, name: 'Bibliothèque Colette Vivier', namecode:'Colette Vivier', code:'CV', x: 48.8897843, y: 2.3196463 },
{ spec: 0, name: 'Bibliothèque des Batignolles', namecode:'Batignolles', code:'BA', x: 48.8844548, y: 2.3219231 },
{ spec: 0, name: 'Médiathèque Edmond Rostand', namecode:'Edmond Rostand', code:'ER', x: 48.8883391, y: 2.3034488 },
{ spec: 0, name: 'Bibliothèque Robert Sabatier', namecode:'Robert Sabatier', code:'RS', x: 48.89157, y: 2.34434 },
{ spec: 0, name: 'Bibliothèque Goutte d\'Or', namecode:'Goutte d\'Or', code:'GO', x: 48.8844, y: 2.35424 },
{ spec: 0, name: 'Bibliothèque Jacqueline de Romilly', namecode:'Jacqueline de Romilly', code:'JR', x: 48.8994635, y: 2.3364756 },
{ spec: 0, name: 'Bibliothèque Václav Havel', namecode:'Vaclav Havel', code:'VH', x: 48.88899, y: 2.36311 },
{ spec: 0, name: 'Bibliothèque Maurice Genevoix', namecode:'Maurice Genevoix', code:'MX', x: 48.8949090, y: 2.3637139 },
{ spec: 0, name: 'Bibliothèque Astrid Lindgren', namecode:'Astrid Lindgren', code:'AG', x: 48.8848656, y: 2.3830530 },
{ spec: 0, name: 'Bibliothèque Hergé', namecode:'Hergé', code:'HG', x: 48.8850502, y: 2.3673219 },
{ spec: 0, name: 'Bibliothèque Jacqueline Dreyfus-Weill ', namecode:'Jacqueline Dreyfus-Weill', code:'DW', x: 48.87629, y: 2.38818 },
{ spec: 0, name: 'Bibliothèque Claude Lévi-Strauss', namecode:'Claude Levi-Strauss', code:'LS', x: 48.8866840, y: 2.3712948 },
{ spec: 0, name: 'Bibliothèque Louise Michel', namecode:'Louise Michel', code:'MI', x: 48.8533051, y: 2.4010825 },
{ spec: 0, name: 'Bibliothèque Benjamin Rabier', namecode:'Benjamin Rabier ', code:'BR', x: 48.8927830, y: 2.3790539 },
{ spec: 0, name: 'Médiathèque James Baldwin', namecode:'James Baldwin', code:'BW', x: 48.876730, y: 2.396590 },
{ spec: 2, name: 'Archives de Paris - Salle de lecture et bibliothèque', namecode:'75XXX', code:'AR', x: 48.87909, y: 2.4067 },
{ spec: 0, name: 'Bibliothèque Oscar Wilde', namecode:'Oscar Wilde', code:'OW', x: 48.8720638, y: 2.3998952 },
{ spec: 0, name: 'Bibliothèque Naguib Mahfouz', namecode:'Naguib Mahfouz', code:'NM', x: 48.8700484, y: 2.3852126 },
{ spec: 0, name: 'Bibliothèque Jeunesse Mortier', namecode:'Mortier', code:'MO', x: 48.8714000, y: 2.4083505 },
{ spec: 0, name: 'Bibliothèque Maryse Condé', namecode:'Maryse Condé', code:'MC', x: 48.8659982, y: 2.3928863 },
{ spec: 0, name: 'Médiathèque Marguerite Duras', namecode:'Marguerite Duras', code:'DS', x: 48.85992, y: 2.403 },
{ spec: 0, name: 'Bibliothèque Assia Djebar', namecode:'Assia Djebar', code:'DJ', x: 48.8492175, y: 2.4121327 }
];
