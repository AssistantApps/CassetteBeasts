if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,c)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let r={};const d=e=>i(e,n),f={module:{uri:n},exports:r,require:d};s[n]=Promise.all(a.map((e=>f[e]||d(e)))).then((e=>(c(...e),r)))}}define(["./workbox-88575b92"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"about.html",revision:"8958febb954616d58bc1ac2988fdb330"},{url:"assets/css/main.css",revision:"021c6152d133d3b43f3836640c0fa150"},{url:"assets/favicon/favicon-16x16.png",revision:"bcc0e3732095e9565ab671fa53949f76"},{url:"assets/favicon/favicon-32x32.png",revision:"1c24dd8e911361a920a56ed6af171d49"},{url:"assets/favicon/favicon-48x48.png",revision:"7ff13fe23f46fc2984c25c042127e693"},{url:"assets/favicon/favicon.ico",revision:"7532665064ce70857428eec95b5138ec"},{url:"assets/favicon/favicon.png",revision:"c1ac05e3b2ee95e08262675f2daedf75"},{url:"assets/img/ability/climb.png",revision:"2bf6c49187b7618f81cbec102c347a9b"},{url:"assets/img/ability/dash.png",revision:"2d873da0f2f6512df22f482f0699ac9a"},{url:"assets/img/ability/flight.png",revision:"4b1efd450df8c2b3604c4c286fd9d057"},{url:"assets/img/ability/glide.png",revision:"aa8e7c807ca39772857e5dfbb55a91df"},{url:"assets/img/ability/magnetism.png",revision:"cee77d60e007d898675b9db42808ff86"},{url:"assets/img/ability/swim.png",revision:"8419760da40287fd85d2f7a89d27d7f0"},{url:"assets/img/ability/unknown.png",revision:"689e8cf70313f0f7fbc5dd6d0d43e688"},{url:"assets/img/assistantApps-32.png",revision:"0c90d0cafcccb3f5c3fbf22c8f25da37"},{url:"assets/img/backup_tape_icon.png",revision:"cb99a2698911054ca175f0be0f46861f"},{url:"assets/img/battle_normal.png",revision:"2eb7698741c57a8324818ad36d508375"},{url:"assets/img/characters.png",revision:"1c47de77a3d06a8d28a046a2ded75387"},{url:"assets/img/collected_tape_xs.png",revision:"67d1e89da5dddb9375d77530350a4a0b"},{url:"assets/img/collected_tape.png",revision:"56a54cc7b5c105ca0806e5e21df92640"},{url:"assets/img/dlc/pier.png",revision:"3eb557e2ee990aa00aa69652d464e89d"},{url:"assets/img/evo_splash_04.png",revision:"38cabf96827d91587dd1894893e36d06"},{url:"assets/img/home.png",revision:"911b8ef4c9526b571c9c3a77ee7ec0b2"},{url:"assets/img/language.png",revision:"2cd2440c9c246b38a9107d4d20c56b13"},{url:"assets/img/logo.png",revision:"2a652438f72030a0f65849231e4783c5"},{url:"assets/img/moves.png",revision:"19e60b3c465c22fff33ee7638aaf0fd0"},{url:"assets/img/passive_quest_icon.png",revision:"53d378a832f116cd45918d016ce9e98d"},{url:"assets/img/tape_reel.png",revision:"5ce71eff084a8ca5968750ede4cd942f"},{url:"assets/img/typeless.png",revision:"ea526e203ee4389025e16a3473895072"},{url:"assets/img/typeless2.png",revision:"624d824ff559a66ae00b6d7503aac12f"},{url:"assets/img/wiki.png",revision:"c15adc339a3a4157dd1f39e9a47c4028"},{url:"favicon.ico",revision:"7532665064ce70857428eec95b5138ec"},{url:"index.html",revision:"3e26d5af5143218a92d339026ed67cfd"},{url:"privacy_policy.html",revision:"c3bc5ffaf0e5f3cbf405461cb4a68a9f"},{url:"terms_and_conditions.html",revision:"bd7c169e75bd262f9223e45ec6112c93"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/,/^standalone/]})}));
//# sourceMappingURL=sw.js.map
