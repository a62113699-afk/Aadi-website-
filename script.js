(function(){
  "use strict";
  // Safe DOM helpers: everything is inserted as plain text, never as HTML.
  function el(tag, cls, text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
  function setText(id,t){var n=document.getElementById(id);if(n)n.textContent=t||"";}
  function safeUrl(u,allowed){try{var x=new URL(u);return allowed.indexOf(x.protocol)>-1?x.href:null;}catch(e){return null;}}
  function link(label,href){var a=el("a","",label);a.href=href;a.target="_blank";a.rel="noopener noreferrer";return a;}

  fetch("content.json",{cache:"no-cache"}).then(function(r){return r.json();}).then(function(c){
    document.title=c.name+" – "+c.tagline;
    setText("name",c.name);setText("tagline",c.tagline);
    setText("about-text",c.about);setText("support-text",c.support);
    var t=document.getElementById("teams-list");
    (c.teams||[]).forEach(function(x){t.appendChild(el("li","",x));});
    var b=document.getElementById("bearers-list");
    (c.bearers||[]).forEach(function(p){
      var card=el("div","card");
      var img=safeUrl(location.origin+"/"+(p.photo||""),["https:","http:"]);
      if(p.photo&&/^images\/[\w.-]+$/.test(p.photo)){var i=el("img","avatar");i.src=p.photo;i.alt=p.name;card.appendChild(i);}
      else card.appendChild(el("div","avatar"));
      card.appendChild(el("div","role",p.role));card.appendChild(el("div","",p.name));b.appendChild(card);
    });
    setText("trinity-title",c.trinity.title);setText("trinity-text",c.trinity.text);
    var tp=document.getElementById("trinity-points");
    (c.trinity.points||[]).forEach(function(x){tp.appendChild(el("li","",x));});
    var cl=document.getElementById("contact-list"),k=c.contact||{},u;
    if((u=safeUrl(k.instagram,["https:"])))cl.appendChild(link("Instagram: @biolyticamaitreyi",u));
    if((u=safeUrl(k.linkedin,["https:"])))cl.appendChild(link("LinkedIn: Biolytica – The Life Science Society",u));
    if((u=safeUrl(k.whatsapp,["https:"])))cl.appendChild(link("Join our WhatsApp group",u));
    if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(k.email||"")){var m=el("a","",k.email);m.href="mailto:"+k.email;cl.appendChild(m);}
    setText("footer",c.footer);
  }).catch(function(){setText("tagline","Content could not be loaded. Please refresh.");});
})();
