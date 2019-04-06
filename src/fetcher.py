import requests

class HitomiFetcher:
    NAME = "Hitomi.la"
    DOMAIN = "ltn.hitomi.la"
    NOZOMIEXTENSION = ".nozomi"
	


function fetch_nozomi() {
        var filepath = decodeURIComponent(document.location.href.replace(/.*hitomi\.la\//, ''));
        if (!filepath) {
                tag = 'index';
                language = 'all';
                page_number = 1;
        } else {
                var elements = filepath.replace(/\.html$/, '').split('-');
                if (elements.length < 3) return;
                while (elements.length > 3) {
                        elements[1] = elements[0] + '-' + elements[1];
                        elements.shift();
                }

                tag = elements[0];
                if (tag.match(/\//)) {
                        var area_elements = tag.split(/\//);
                        if (area_elements.length !== 2) return;

                        area = area_elements[0];
                        if (!area || area.match(/[^A-Za-z0-9_]/)) return;
        
                        tag = area_elements[1];
                }
                if (!tag || tag.match(/[^A-Za-z0-9_: .-]/)) return;

                language = elements[1];
                if (!language || language.match(/[^A-Za-z]/)) return;

                page_number = parseInt(elements[2]);
                if (!page_number || page_number < 1) return;
        }
        var nozomi_address = '//'+[domain, [tag, language].join('-')].join('/')+nozomiextension;
        if (area) {
                nozomi_address = '//'+[domain, area, [tag, language].join('-')].join('/')+nozomiextension;
        }
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', nozomi_address, true);
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function(oEvent) {
                if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                                var arrayBuffer = xhr.response; // Note: not oReq.responseText
                                if (arrayBuffer) {
                                        var view = new DataView(arrayBuffer);
                                        var total = view.byteLength/4;
                                        for (var i = 0; i < total; i++) {
                                                nozomi.push(view.getInt32(i*4, false /* big-endian */));
                                        }
                                        put_results_on_page();
                                }
                        }
                }
        };
        xhr.send();
}