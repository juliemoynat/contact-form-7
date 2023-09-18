(()=>{"use strict";const e=e=>Math.abs(parseInt(e,10)),t=(e,t)=>{const a=new Map([["init","init"],["validation_failed","invalid"],["acceptance_missing","unaccepted"],["spam","spam"],["aborted","aborted"],["mail_sent","sent"],["mail_failed","failed"],["submitting","submitting"],["resetting","resetting"],["validating","validating"],["payment_required","payment-required"]]);a.has(t)&&(t=a.get(t)),Array.from(a.values()).includes(t)||(t=`custom-${t=(t=t.replace(/[^0-9a-z]+/i," ").trim()).replace(/\s+/,"-")}`);const r=e.getAttribute("data-status");return e.wpcf7.status=t,e.setAttribute("data-status",t),e.classList.add(t),r&&r!==t&&e.classList.remove(r),t},a=(e,t,a)=>{const r=new CustomEvent(`wpcf7${t}`,{bubbles:!0,detail:a});"string"==typeof e&&(e=document.querySelector(e)),e.dispatchEvent(r)},r=e=>{const{root:t,namespace:a="contact-form-7/v1"}=wpcf7.api;return n.reduceRight(((e,t)=>a=>t(a,e)),(e=>{let r,n,{url:o,path:c,endpoint:i,headers:s,body:l,data:d,...u}=e;"string"==typeof i&&(r=a.replace(/^\/|\/$/g,""),n=i.replace(/^\//,""),c=n?r+"/"+n:r),"string"==typeof c&&(-1!==t.indexOf("?")&&(c=c.replace("?","&")),c=c.replace(/^\//,""),o=t+c),s={Accept:"application/json, */*;q=0.1",...s},delete s["X-WP-Nonce"],d&&(l=JSON.stringify(d),s["Content-Type"]="application/json");const p={code:"fetch_error",message:"You are probably offline."},f={code:"invalid_json",message:"The response is not a valid JSON response."};return window.fetch(o||c||window.location.href,{...u,headers:s,body:l}).then((e=>Promise.resolve(e).then((e=>{if(e.status>=200&&e.status<300)return e;throw e})).then((e=>{if(204===e.status)return null;if(e&&e.json)return e.json().catch((()=>{throw f}));throw f}))),(()=>{throw p}))}))(e)},n=[];function o(e,a={}){var r;const{target:n,scope:o=e,...l}=a;if(void 0===e.wpcf7?.schema)return;const d={...e.wpcf7.schema};if(void 0!==n){if(!e.contains(n))return;if(!n.closest(".wpcf7-form-control-wrap[data-name]"))return;if(n.closest(".novalidate"))return}const u=new FormData,p=[];for(const e of o.querySelectorAll(".wpcf7-form-control-wrap"))if(!e.closest(".novalidate")&&(e.querySelectorAll(":where( input, textarea, select ):enabled").forEach((e=>{if(e.name)switch(e.type){case"button":case"image":case"reset":case"submit":break;case"checkbox":case"radio":e.checked&&u.append(e.name,e.value);break;case"select-multiple":for(const t of e.selectedOptions)u.append(e.name,t.value);break;case"file":for(const t of e.files)u.append(e.name,t);break;default:u.append(e.name,e.value)}})),e.dataset.name&&(p.push(e.dataset.name),e.setAttribute("data-under-validation","1"),e.contains(n))))break;d.rules=(null!==(r=d.rules)&&void 0!==r?r:[]).filter((({field:e})=>p.includes(e)));const f=e.getAttribute("data-status");Promise.resolve(t(e,"validating")).then((t=>{if(void 0!==swv){const t=swv.validate(d,u,a);for(const[a,{error:r,validInputs:n}]of t)i(e,a),void 0!==r&&c(e,a,r,{scope:o}),s(e,a,null!=n?n:[])}})).finally((()=>{t(e,f),e.querySelectorAll(".wpcf7-form-control-wrap[data-under-validation]").forEach((e=>{e.removeAttribute("data-under-validation")}))}))}r.use=e=>{n.unshift(e)};const c=(e,t,a,r)=>{const{scope:n=e,...o}=null!=r?r:{},c=`${e.wpcf7?.unitTag}-ve-${t}`.replaceAll(/[^0-9a-z_-]+/gi,"");e.querySelector(`.wpcf7-form-control-wrap[data-name="${t}"] .wpcf7-form-control`),n.querySelectorAll(`.wpcf7-form-control-wrap[data-name="${t}"]`).forEach((t=>{if("validating"===e.getAttribute("data-status")&&!t.dataset.underValidation)return;const r=document.createElement("span");r.classList.add("wpcf7-not-valid-tip"),r.setAttribute("id",c),r.insertAdjacentText("beforeend",a),t.appendChild(r),t.querySelectorAll("[aria-invalid]").forEach((e=>{e.setAttribute("aria-invalid","true")})),t.querySelectorAll(".wpcf7-form-control").forEach((e=>{e.classList.add("wpcf7-not-valid"),e.setAttribute("aria-describedby",c),"file"==e.type?(e.setAttribute("aria-labelledby",e.getAttribute("aria-labelledby")+" "+c),e.removeAttribute("aria-describedby")):"fieldset"==e.nodeName.toLowerCase()||"span"==e.nodeName.toLowerCase()?e.querySelectorAll("input").forEach((e=>{e.setAttribute("aria-describedby",c)})):e.setAttribute("aria-describedby",c),"function"==typeof e.setCustomValidity&&e.setCustomValidity(a),e.closest(".use-floating-validation-tip")&&(e.addEventListener("focus",(e=>{r.setAttribute("style","display: none")})),r.addEventListener("click",(e=>{r.setAttribute("style","display: none")})))}))}))},i=(e,t)=>{const a=`${e.wpcf7?.unitTag}-ve-${t}`.replaceAll(/[^0-9a-z_-]+/gi,"");e.querySelectorAll(`.wpcf7-form-control-wrap[data-name="${t}"]`).forEach((e=>{e.querySelector(".wpcf7-not-valid-tip")?.remove(),e.querySelectorAll("[aria-invalid]").forEach((e=>{if(e.setAttribute("aria-invalid","false"),"file"==e.getAttribute("type")){let t=e.getAttribute("aria-labelledby");t=t.split(" "),t=t.filter((function(e){return e!=a})),e.setAttribute("aria-labelledby",t.join(" "))}})),e.querySelectorAll(".wpcf7-form-control").forEach((e=>{e.removeAttribute("aria-describedby"),e.classList.remove("wpcf7-not-valid"),"function"==typeof e.setCustomValidity&&e.setCustomValidity("")}))}))},s=(e,t,a)=>{e.querySelectorAll(`[data-reflection-of="${t}"]`).forEach((e=>{if("output"===e.tagName.toLowerCase()){const t=e;0===a.length&&a.push(t.dataset.default),a.slice(0,1).forEach((e=>{e instanceof File&&(e=e.name),t.textContent=e}))}else e.querySelectorAll("output").forEach((e=>{e.hasAttribute("data-default")?0===a.length?e.removeAttribute("hidden"):e.setAttribute("hidden","hidden"):e.remove()})),a.forEach((a=>{a instanceof File&&(a=a.name);const r=document.createElement("output");r.setAttribute("name",t),r.textContent=a,e.appendChild(r)}))}))};function l(e,n={}){if(wpcf7.blocked)return d(e),void t(e,"submitting");const o=new FormData(e);n.submitter&&n.submitter.name&&o.append(n.submitter.name,n.submitter.value);const i={contactFormId:e.wpcf7.id,pluginVersion:e.wpcf7.pluginVersion,contactFormLocale:e.wpcf7.locale,unitTag:e.wpcf7.unitTag,containerPostId:e.wpcf7.containerPost,status:e.wpcf7.status,inputs:Array.from(o,(e=>{const t=e[0],a=e[1];return!t.match(/^_/)&&{name:t,value:a}})).filter((e=>!1!==e)),formData:o};r({endpoint:`contact-forms/${e.wpcf7.id}/feedback`,method:"POST",body:o,wpcf7:{endpoint:"feedback",form:e,detail:i}}).then((r=>{const n=t(e,r.status);return i.status=r.status,i.apiResponse=r,["invalid","unaccepted","spam","aborted"].includes(n)?a(e,n,i):["sent","failed"].includes(n)&&a(e,`mail${n}`,i),a(e,"submit",i),r})).then((t=>{t.posted_data_hash&&(e.querySelector('input[name="_wpcf7_posted_data_hash"]').value=t.posted_data_hash),"mail_sent"===t.status&&(e.querySelector(".wpcf7-response-output").focus(),e.reset(),e.wpcf7.resetOnMailSent=!0),t.invalid_fields&&t.invalid_fields.forEach((t=>{c(e,t.field,t.message)})),e.querySelectorAll(".wpcf7-response-output").forEach((e=>{var a=document.createElement("p");a.textContent=t.message,e.appendChild(a),setTimeout((()=>{e.focus()}),1e3)}))})).catch((e=>console.error(e)))}r.use(((e,r)=>{if(e.wpcf7&&"feedback"===e.wpcf7.endpoint){const{form:r,detail:n}=e.wpcf7;d(r),a(r,"beforesubmit",n),t(r,"submitting")}return r(e)}));const d=e=>{e.querySelectorAll(".wpcf7-form-control-wrap").forEach((t=>{t.dataset.name&&i(e,t.dataset.name)})),e.querySelectorAll(".wpcf7-response-output").forEach((e=>{e.innerText=""}))};function u(e){const n=new FormData(e),o={contactFormId:e.wpcf7.id,pluginVersion:e.wpcf7.pluginVersion,contactFormLocale:e.wpcf7.locale,unitTag:e.wpcf7.unitTag,containerPostId:e.wpcf7.containerPost,status:e.wpcf7.status,inputs:Array.from(n,(e=>{const t=e[0],a=e[1];return!t.match(/^_/)&&{name:t,value:a}})).filter((e=>!1!==e)),formData:n};r({endpoint:`contact-forms/${e.wpcf7.id}/refill`,method:"GET",wpcf7:{endpoint:"refill",form:e,detail:o}}).then((r=>{e.wpcf7.resetOnMailSent?(delete e.wpcf7.resetOnMailSent,t(e,"mail_sent")):t(e,"init"),o.apiResponse=r,a(e,"reset",o)})).catch((e=>console.error(e)))}r.use(((e,a)=>{if(e.wpcf7&&"refill"===e.wpcf7.endpoint){const{form:a,detail:r}=e.wpcf7;d(a),t(a,"resetting")}return a(e)}));const p=(e,t)=>{for(const a in t){const r=t[a];e.querySelectorAll(`input[name="${a}"]`).forEach((e=>{e.value=""})),e.querySelectorAll(`img.wpcf7-captcha-${a.replaceAll(":","")}`).forEach((e=>{e.setAttribute("src",r)}));const n=/([0-9]+)\.(png|gif|jpeg)$/.exec(r);n&&e.querySelectorAll(`input[name="_wpcf7_captcha_challenge_${a}"]`).forEach((e=>{e.value=n[1]}))}},f=(e,t)=>{for(const a in t){const r=t[a][0],n=t[a][1];e.querySelectorAll(`.wpcf7-form-control-wrap[data-name="${a}"]`).forEach((e=>{e.querySelector(`input[name="${a}"]`).value="",e.querySelector(".wpcf7-quiz-label").textContent=r,e.querySelector(`input[name="_wpcf7_quiz_answer_${a}"]`).value=n}))}};function m(t){const a=new FormData(t);t.wpcf7={id:e(a.get("_wpcf7")),status:t.getAttribute("data-status"),pluginVersion:a.get("_wpcf7_version"),locale:a.get("_wpcf7_locale"),unitTag:a.get("_wpcf7_unit_tag"),containerPost:e(a.get("_wpcf7_container_post")),parent:t.closest(".wpcf7"),schema:void 0},t.querySelectorAll(".has-spinner").forEach((e=>{e.insertAdjacentHTML("afterend",'<span class="wpcf7-spinner"></span>')})),t.querySelectorAll(".wpcf7-file").forEach((e=>{if(!e.getAttribute("aria-labelledby")&&e.getAttribute("id")){var a=t.querySelectorAll('label[for="'+e.getAttribute("id")+'"]');if(1==a.length){var r=a[0],n=r.id;n||(n="cf7-a11y-label-"+Math.random().toString(36).substr(2,9),r.setAttribute("id",n)),e.setAttribute("aria-labelledby",r.id)}}})),(e=>{e.querySelectorAll(".wpcf7-exclusive-checkbox").forEach((t=>{t.addEventListener("change",(t=>{const a=t.target.getAttribute("name");e.querySelectorAll(`input[type="checkbox"][name="${a}"]`).forEach((e=>{e!==t.target&&(e.checked=!1)}))}))}))})(t),(e=>{e.querySelectorAll(".has-free-text").forEach((t=>{const a=t.querySelector("input.wpcf7-free-text"),r=t.querySelector('input[type="checkbox"], input[type="radio"]');a.disabled=!r.checked,e.addEventListener("change",(e=>{a.disabled=!r.checked,e.target===r&&r.checked&&a.focus()}))}))})(t),(e=>{e.querySelectorAll(".wpcf7-validates-as-url").forEach((e=>{e.addEventListener("change",(t=>{let a=e.value.trim();a&&!a.match(/^[a-z][a-z0-9.+-]*:/i)&&-1!==a.indexOf(".")&&(a=a.replace(/^\/+/,""),a="http://"+a),e.value=a}))}))})(t),(e=>{if(!e.querySelector(".wpcf7-acceptance")||e.classList.contains("wpcf7-acceptance-as-validation"))return;const t=()=>{let t=!0;e.querySelectorAll(".wpcf7-acceptance").forEach((e=>{if(!t||e.classList.contains("optional"))return;const a=e.querySelector('input[type="checkbox"]');(e.classList.contains("invert")&&a.checked||!e.classList.contains("invert")&&!a.checked)&&(t=!1)})),e.querySelectorAll(".wpcf7-submit").forEach((e=>{e.disabled=!t}))};t(),e.addEventListener("change",(e=>{t()})),e.addEventListener("wpcf7reset",(e=>{t()}))})(t),(t=>{const a=(t,a)=>{const r=e(t.getAttribute("data-starting-value")),n=e(t.getAttribute("data-maximum-value")),o=e(t.getAttribute("data-minimum-value")),c=t.classList.contains("down")?r-a.value.length:a.value.length;t.setAttribute("data-current-value",c),t.innerText=c,n&&n<a.value.length?t.classList.add("too-long"):t.classList.remove("too-long"),o&&a.value.length<o?t.classList.add("too-short"):t.classList.remove("too-short")},r=e=>{e={init:!1,...e},t.querySelectorAll(".wpcf7-character-count").forEach((r=>{const n=r.getAttribute("data-target-name"),o=t.querySelector(`[name="${n}"]`);o&&(o.value=o.defaultValue,a(r,o),e.init&&o.addEventListener("keyup",(e=>{a(r,o)})))}))};r({init:!0}),t.addEventListener("wpcf7reset",(e=>{r()}))})(t),window.addEventListener("load",(e=>{wpcf7.cached&&t.reset()})),t.addEventListener("reset",(e=>{wpcf7.reset(t)})),t.addEventListener("submit",(e=>{wpcf7.submit(t,{submitter:e.submitter}),e.preventDefault()})),t.addEventListener("wpcf7submit",(e=>{e.detail.apiResponse.captcha&&p(t,e.detail.apiResponse.captcha),e.detail.apiResponse.quiz&&f(t,e.detail.apiResponse.quiz)})),t.addEventListener("wpcf7reset",(e=>{e.detail.apiResponse.captcha&&p(t,e.detail.apiResponse.captcha),e.detail.apiResponse.quiz&&f(t,e.detail.apiResponse.quiz)})),r({endpoint:`contact-forms/${t.wpcf7.id}/feedback/schema`,method:"GET"}).then((e=>{t.wpcf7.schema=e})),t.addEventListener("change",(e=>{e.target.closest(".wpcf7-form-control")&&wpcf7.validate(t,{target:e.target})}))}document.addEventListener("DOMContentLoaded",(e=>{var t;"undefined"!=typeof wpcf7?void 0!==wpcf7.api?"function"==typeof window.fetch?"function"==typeof window.FormData?"function"==typeof NodeList.prototype.forEach?"function"==typeof String.prototype.replaceAll?(wpcf7={init:m,submit:l,reset:u,validate:o,...null!==(t=wpcf7)&&void 0!==t?t:{}},document.querySelectorAll(".wpcf7 > form").forEach((e=>{wpcf7.init(e),e.closest(".wpcf7").classList.replace("no-js","js")}))):console.error("Your browser does not support String.replaceAll()."):console.error("Your browser does not support NodeList.forEach()."):console.error("Your browser does not support window.FormData()."):console.error("Your browser does not support window.fetch()."):console.error("wpcf7.api is not defined."):console.error("wpcf7 is not defined.")}))})();