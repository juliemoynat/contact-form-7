(()=>{"use strict";const e=e=>Math.abs(parseInt(e,10)),t=(e,t,a)=>{const r=new CustomEvent(`wpcf7${t}`,{bubbles:!0,detail:a});"string"==typeof e&&(e=document.querySelector(e)),e.dispatchEvent(r)},a=(e,a)=>{const r=new Map([["init","init"],["validation_failed","invalid"],["acceptance_missing","unaccepted"],["spam","spam"],["aborted","aborted"],["mail_sent","sent"],["mail_failed","failed"],["submitting","submitting"],["resetting","resetting"],["validating","validating"],["payment_required","payment-required"]]);r.has(a)&&(a=r.get(a)),Array.from(r.values()).includes(a)||(a=`custom-${a=(a=a.replace(/[^0-9a-z]+/i," ").trim()).replace(/\s+/,"-")}`);const n=e.getAttribute("data-status");if(e.wpcf7.status=a,e.setAttribute("data-status",a),e.classList.add(a),n&&n!==a){e.classList.remove(n);const a={contactFormId:e.wpcf7.id,pluginVersion:e.wpcf7.pluginVersion,contactFormLocale:e.wpcf7.locale,unitTag:e.wpcf7.unitTag,containerPostId:e.wpcf7.containerPost,status:e.wpcf7.status,prevStatus:n};t(e,"statuschanged",a)}return a},r=e=>{const{root:t,namespace:a="contact-form-7/v1"}=wpcf7.api;return n.reduceRight(((e,t)=>a=>t(a,e)),(e=>{let r,n,{url:o,path:c,endpoint:s,headers:i,body:l,data:u,...d}=e;"string"==typeof s&&(r=a.replace(/^\/|\/$/g,""),n=s.replace(/^\//,""),c=n?r+"/"+n:r),"string"==typeof c&&(-1!==t.indexOf("?")&&(c=c.replace("?","&")),c=c.replace(/^\//,""),o=t+c),i={Accept:"application/json, */*;q=0.1",...i},delete i["X-WP-Nonce"],u&&(l=JSON.stringify(u),i["Content-Type"]="application/json");const p={code:"fetch_error",message:"You are probably offline."},f={code:"invalid_json",message:"The response is not a valid JSON response."};return window.fetch(o||c||window.location.href,{...d,headers:i,body:l}).then((e=>Promise.resolve(e).then((e=>{if(e.status>=200&&e.status<300)return e;throw e})).then((e=>{if(204===e.status)return null;if(e&&e.json)return e.json().catch((()=>{throw f}));throw f}))),(()=>{throw p}))}))(e)},n=[];function o(e,t={}){const{target:r,scope:n=e,...o}=t;if(void 0===e.wpcf7?.schema)return;const l={...e.wpcf7.schema};if(void 0!==r){if(!e.contains(r))return;if(!r.closest(".wpcf7-form-control-wrap[data-name]"))return;if(r.closest(".novalidate"))return}const u=n.querySelectorAll(".wpcf7-form-control-wrap"),d=Array.from(u).reduce(((e,t)=>(t.closest(".novalidate")||t.querySelectorAll(":where( input, textarea, select ):enabled").forEach((t=>{if(t.name)switch(t.type){case"button":case"image":case"reset":case"submit":break;case"checkbox":case"radio":t.checked&&e.append(t.name,t.value);break;case"select-multiple":for(const a of t.selectedOptions)e.append(t.name,a.value);break;case"file":for(const a of t.files)e.append(t.name,a);break;default:e.append(t.name,t.value)}})),e)),new FormData),p=e.getAttribute("data-status");Promise.resolve(a(e,"validating")).then((a=>{if(void 0!==swv){const a=swv.validate(l,d,t);for(const t of u){if(void 0===t.dataset.name)continue;const o=t.dataset.name;if(a.has(o)){const{error:t,validInputs:r}=a.get(o);s(e,o),void 0!==t&&c(e,o,t,{scope:n}),i(e,o,null!=r?r:[])}if(t.contains(r))break}}})).finally((()=>{a(e,p)}))}r.use=e=>{n.unshift(e)};const c=(e,t,a,r)=>{const{scope:n=e,...o}=null!=r?r:{},c=`${e.wpcf7?.unitTag}-ve-${t}`.replaceAll(/[^0-9a-z_-]+/gi,"");e.querySelector(`.wpcf7-form-control-wrap[data-name="${t}"] .wpcf7-form-control`),n.querySelectorAll(`.wpcf7-form-control-wrap[data-name="${t}"]`).forEach((e=>{const t=document.createElement("span");t.classList.add("wpcf7-not-valid-tip"),t.setAttribute("id",c),t.insertAdjacentText("beforeend",a),e.appendChild(t),e.querySelectorAll("[aria-invalid]").forEach((e=>{e.setAttribute("aria-invalid","true")})),e.querySelectorAll(".wpcf7-form-control").forEach((e=>{e.classList.add("wpcf7-not-valid"),"file"==e.type?(e.setAttribute("aria-labelledby",e.getAttribute("aria-labelledby")+" "+c),e.removeAttribute("aria-describedby")):"fieldset"==e.nodeName.toLowerCase()||"span"==e.nodeName.toLowerCase()?e.querySelectorAll("input").forEach((e=>{e.setAttribute("aria-describedby",c)})):e.setAttribute("aria-describedby",c),"function"==typeof e.setCustomValidity&&e.setCustomValidity(a),e.closest(".use-floating-validation-tip")&&(e.addEventListener("focus",(e=>{t.setAttribute("style","display: none")})),t.addEventListener("click",(e=>{t.setAttribute("style","display: none")})))}))}))},s=(e,t)=>{const a=`${e.wpcf7?.unitTag}-ve-${t}`.replaceAll(/[^0-9a-z_-]+/gi,"");e.querySelectorAll(`.wpcf7-form-control-wrap[data-name="${t}"]`).forEach((e=>{e.querySelector(".wpcf7-not-valid-tip")?.remove(),e.querySelectorAll("[aria-invalid]").forEach((e=>{e.setAttribute("aria-invalid","false")})),e.querySelectorAll(".wpcf7-form-control").forEach((e=>{if("fieldset"!=e.nodeName.toLowerCase()&&"span"!=e.nodeName.toLowerCase()||e.querySelectorAll("input").forEach((e=>{e.removeAttribute("aria-describedby")})),"file"==e.getAttribute("type")){let t=e.getAttribute("aria-labelledby");t=t.split(" "),t=t.filter((function(e){return e!=a})),e.setAttribute("aria-labelledby",t.join(" "))}e.removeAttribute("aria-describedby"),e.classList.remove("wpcf7-not-valid"),"function"==typeof e.setCustomValidity&&e.setCustomValidity("")}))}))},i=(e,t,a)=>{e.querySelectorAll(`[data-reflection-of="${t}"]`).forEach((e=>{if("output"===e.tagName.toLowerCase()){const t=e;0===a.length&&a.push(t.dataset.default),a.slice(0,1).forEach((e=>{e instanceof File&&(e=e.name),t.textContent=e}))}else e.querySelectorAll("output").forEach((e=>{e.hasAttribute("data-default")?0===a.length?e.removeAttribute("hidden"):e.setAttribute("hidden","hidden"):e.remove()})),a.forEach((a=>{a instanceof File&&(a=a.name);const r=document.createElement("output");r.setAttribute("name",t),r.textContent=a,e.appendChild(r)}))}))};function l(e,n={}){if(wpcf7.blocked)return u(e),void a(e,"submitting");const o=new FormData(e);n.submitter&&n.submitter.name&&o.append(n.submitter.name,n.submitter.value);const s={contactFormId:e.wpcf7.id,pluginVersion:e.wpcf7.pluginVersion,contactFormLocale:e.wpcf7.locale,unitTag:e.wpcf7.unitTag,containerPostId:e.wpcf7.containerPost,status:e.wpcf7.status,inputs:Array.from(o,(e=>{const t=e[0],a=e[1];return!t.match(/^_/)&&{name:t,value:a}})).filter((e=>!1!==e)),formData:o};r({endpoint:`contact-forms/${e.wpcf7.id}/feedback`,method:"POST",body:o,wpcf7:{endpoint:"feedback",form:e,detail:s}}).then((r=>{const n=a(e,r.status);return s.status=r.status,s.apiResponse=r,["invalid","unaccepted","spam","aborted"].includes(n)?t(e,n,s):["sent","failed"].includes(n)&&t(e,`mail${n}`,s),t(e,"submit",s),r})).then((t=>{t.posted_data_hash&&(e.querySelector('input[name="_wpcf7_posted_data_hash"]').value=t.posted_data_hash),"mail_sent"===t.status&&(e.querySelector(".wpcf7-response-output").focus(),e.reset(),e.wpcf7.resetOnMailSent=!0),t.invalid_fields&&t.invalid_fields.forEach((t=>{c(e,t.field,t.message)})),e.querySelectorAll(".wpcf7-response-output").forEach((e=>{var a=document.createElement("p");a.textContent=t.message,e.appendChild(a),setTimeout((()=>{e.focus()}),1e3)}))})).catch((e=>console.error(e)))}r.use(((e,r)=>{if(e.wpcf7&&"feedback"===e.wpcf7.endpoint){const{form:r,detail:n}=e.wpcf7;u(r),t(r,"beforesubmit",n),a(r,"submitting")}return r(e)}));const u=e=>{e.querySelectorAll(".wpcf7-form-control-wrap").forEach((t=>{t.dataset.name&&s(e,t.dataset.name)})),e.querySelectorAll(".wpcf7-response-output").forEach((e=>{e.innerText=""}))};function d(e){const n=new FormData(e),o={contactFormId:e.wpcf7.id,pluginVersion:e.wpcf7.pluginVersion,contactFormLocale:e.wpcf7.locale,unitTag:e.wpcf7.unitTag,containerPostId:e.wpcf7.containerPost,status:e.wpcf7.status,inputs:Array.from(n,(e=>{const t=e[0],a=e[1];return!t.match(/^_/)&&{name:t,value:a}})).filter((e=>!1!==e)),formData:n};r({endpoint:`contact-forms/${e.wpcf7.id}/refill`,method:"GET",wpcf7:{endpoint:"refill",form:e,detail:o}}).then((r=>{e.wpcf7.resetOnMailSent?(delete e.wpcf7.resetOnMailSent,a(e,"mail_sent")):a(e,"init"),o.apiResponse=r,t(e,"reset",o)})).catch((e=>console.error(e)))}r.use(((e,t)=>{if(e.wpcf7&&"refill"===e.wpcf7.endpoint){const{form:t,detail:r}=e.wpcf7;u(t),a(t,"resetting")}return t(e)}));const p=(e,t)=>{for(const a in t){const r=t[a];e.querySelectorAll(`input[name="${a}"]`).forEach((e=>{e.value=""})),e.querySelectorAll(`img.wpcf7-captcha-${a.replaceAll(":","")}`).forEach((e=>{e.setAttribute("src",r)}));const n=/([0-9]+)\.(png|gif|jpeg)$/.exec(r);n&&e.querySelectorAll(`input[name="_wpcf7_captcha_challenge_${a}"]`).forEach((e=>{e.value=n[1]}))}},f=(e,t)=>{for(const a in t){const r=t[a][0],n=t[a][1];e.querySelectorAll(`.wpcf7-form-control-wrap[data-name="${a}"]`).forEach((e=>{e.querySelector(`input[name="${a}"]`).value="",e.querySelector(".wpcf7-quiz-label").textContent=r,e.querySelector(`input[name="_wpcf7_quiz_answer_${a}"]`).value=n}))}};function m(t){const a=new FormData(t);t.wpcf7={id:e(a.get("_wpcf7")),status:t.getAttribute("data-status"),pluginVersion:a.get("_wpcf7_version"),locale:a.get("_wpcf7_locale"),unitTag:a.get("_wpcf7_unit_tag"),containerPost:e(a.get("_wpcf7_container_post")),parent:t.closest(".wpcf7"),get schema(){return wpcf7.schemas.get(this.id)}},wpcf7.schemas.set(t.wpcf7.id,void 0),t.querySelectorAll(".has-spinner").forEach((e=>{e.insertAdjacentHTML("afterend",'<span class="wpcf7-spinner"></span>')})),t.querySelectorAll(".wpcf7-file").forEach((e=>{if(!e.getAttribute("aria-labelledby")&&e.getAttribute("id")){var a=t.querySelectorAll('label[for="'+e.getAttribute("id")+'"]');if(1==a.length){var r=a[0],n=r.id;n||(n="cf7-a11y-label-"+Math.random().toString(36).substr(2,9),r.setAttribute("id",n)),e.setAttribute("aria-labelledby",r.id)}}})),(e=>{e.querySelectorAll(".wpcf7-exclusive-checkbox").forEach((t=>{t.addEventListener("change",(t=>{const a=t.target.getAttribute("name");e.querySelectorAll(`input[type="checkbox"][name="${a}"]`).forEach((e=>{e!==t.target&&(e.checked=!1)}))}))}))})(t),(e=>{e.querySelectorAll(".has-free-text").forEach((t=>{const a=t.querySelector("input.wpcf7-free-text"),r=t.querySelector('input[type="checkbox"], input[type="radio"]');a.disabled=!r.checked,e.addEventListener("change",(e=>{a.disabled=!r.checked,e.target===r&&r.checked&&a.focus()}))}))})(t),(e=>{e.querySelectorAll(".wpcf7-validates-as-url").forEach((e=>{e.addEventListener("change",(t=>{let a=e.value.trim();a&&!a.match(/^[a-z][a-z0-9.+-]*:/i)&&-1!==a.indexOf(".")&&(a=a.replace(/^\/+/,""),a="http://"+a),e.value=a}))}))})(t),(e=>{if(!e.querySelector(".wpcf7-acceptance")||e.classList.contains("wpcf7-acceptance-as-validation"))return;const t=()=>{let t=!0;e.querySelectorAll(".wpcf7-acceptance").forEach((e=>{if(!t||e.classList.contains("optional"))return;const a=e.querySelector('input[type="checkbox"]');(e.classList.contains("invert")&&a.checked||!e.classList.contains("invert")&&!a.checked)&&(t=!1)})),e.querySelectorAll(".wpcf7-submit").forEach((e=>{e.disabled=!t}))};t(),e.addEventListener("change",(e=>{t()})),e.addEventListener("wpcf7reset",(e=>{t()}))})(t),(t=>{const a=(t,a)=>{const r=e(t.getAttribute("data-starting-value")),n=e(t.getAttribute("data-maximum-value")),o=e(t.getAttribute("data-minimum-value")),c=t.classList.contains("down")?r-a.value.length:a.value.length;t.setAttribute("data-current-value",c),t.innerText=c,n&&n<a.value.length?t.classList.add("too-long"):t.classList.remove("too-long"),o&&a.value.length<o?t.classList.add("too-short"):t.classList.remove("too-short")},r=e=>{e={init:!1,...e},t.querySelectorAll(".wpcf7-character-count").forEach((r=>{const n=r.getAttribute("data-target-name"),o=t.querySelector(`[name="${n}"]`);o&&(o.value=o.defaultValue,a(r,o),e.init&&o.addEventListener("keyup",(e=>{a(r,o)})))}))};r({init:!0}),t.addEventListener("wpcf7reset",(e=>{r()}))})(t),window.addEventListener("load",(e=>{wpcf7.cached&&t.reset()})),t.addEventListener("reset",(e=>{wpcf7.reset(t)})),t.addEventListener("submit",(e=>{wpcf7.submit(t,{submitter:e.submitter}),e.preventDefault()})),t.addEventListener("wpcf7submit",(e=>{e.detail.apiResponse.captcha&&p(t,e.detail.apiResponse.captcha),e.detail.apiResponse.quiz&&f(t,e.detail.apiResponse.quiz)})),t.addEventListener("wpcf7reset",(e=>{e.detail.apiResponse.captcha&&p(t,e.detail.apiResponse.captcha),e.detail.apiResponse.quiz&&f(t,e.detail.apiResponse.quiz)})),t.addEventListener("change",(e=>{e.target.closest(".wpcf7-form-control")&&wpcf7.validate(t,{target:e.target})})),t.addEventListener("wpcf7statuschanged",(e=>{const a=e.detail.status;t.querySelectorAll(".active-on-any").forEach((e=>{e.removeAttribute("inert"),e.classList.remove("active-on-any")})),t.querySelectorAll(`.inert-on-${a}`).forEach((e=>{e.setAttribute("inert","inert"),e.classList.add("active-on-any")}))}))}document.addEventListener("DOMContentLoaded",(e=>{var t;if("undefined"!=typeof wpcf7)if(void 0!==wpcf7.api)if("function"==typeof window.fetch)if("function"==typeof window.FormData)if("function"==typeof NodeList.prototype.forEach)if("function"==typeof String.prototype.replaceAll){wpcf7={init:m,submit:l,reset:d,validate:o,schemas:new Map,...null!==(t=wpcf7)&&void 0!==t?t:{}},document.querySelectorAll(".wpcf7 > form").forEach((e=>{wpcf7.init(e),e.closest(".wpcf7").classList.replace("no-js","js")}));for(const e of wpcf7.schemas.keys())r({endpoint:`contact-forms/${e}/feedback/schema`,method:"GET"}).then((t=>{wpcf7.schemas.set(e,t)}))}else console.error("Your browser does not support String.replaceAll().");else console.error("Your browser does not support NodeList.forEach().");else console.error("Your browser does not support window.FormData().");else console.error("Your browser does not support window.fetch().");else console.error("wpcf7.api is not defined.");else console.error("wpcf7 is not defined.")}))})();