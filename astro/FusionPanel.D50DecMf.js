import{g as d,c as P,s as N,t as T,d as j,a as $,i as E,b as S,M as x,e as B,S as D,r as G,u as K,f as h,h as U,j as W}from"./web.DDZZ4TEt.js";const q={logoSplash:"/assets/img/evo_splash_04.png",loader:"/assets/img/loader.svg",moreStatusEffects:"/assets/img/passive_quest_icon.png",moves:"/assets/img/moves.png",characters:"/assets/img/characters.png",meta:"/assets/img/meta/meta_tape_default.png",metaTapeBg:"/assets/img/meta/meta_tape_bg.png",metaTapeBootlegBg:"/assets/img/meta/meta_tape_bootleg_bg.png",metaTapeOverlay:"/assets/img/meta/meta_tape_overlay.png",metaAp:"/assets/img/meta/ap.png",metaApx:"/assets/img/meta/ap-x.png",characterBg:"/assets/img/meta/character_bg.png",tapeBg:"/assets/img/meta/tape.png",tapeBootlegBg:"/assets/img/meta/tape_bootleg.png",tapeOverlay:"/assets/img/meta/tape_overlay.png",unknown:"/assets/img/passive_quest_icon.png"};var Q=T("<img class=noselect draggable=false alt=loading>");const Y=e=>{let r=3;switch(e.size){case"xs":r=1;break;case"sm":r=2;break;case"md":r=3;break;case"lg":r=6;break;case"xl":r=12;break}const u=`${r*8}px`;return(()=>{var o=d(Q);return u!=null?o.style.setProperty("width",u):o.style.removeProperty("width"),u!=null?o.style.setProperty("height",u):o.style.removeProperty("height"),P(()=>N(o,"src",q.loader)),o})()},C="en",Z={remaster:"UI_EVOLUTION_TITLE",stickers:"UI_PARTY_STICKERS",maxHP:"SHORT_NAME_max_hp",mAtk:"SHORT_NAME_melee_attack",mDef:"SHORT_NAME_melee_defense",rAtk:"SHORT_NAME_ranged_attack",rDef:"SHORT_NAME_ranged_defense",speed:"SHORT_NAME_speed",elementalType:"UI_INVENTORY_FILTER_TYPE",name:"UI_INVENTORY_FILTER_NAME",category:"UI_INVENTORY_FILTER_CATEGORY",power:"MOVE_DESCRIPTION_POWER",accuracy:"STAT_accuracy",evasion:"STAT_evasion",maxAP:"STAT_max_ap",moveSlots:"STAT_move_slots",ap:"BATTLE_TOAST_AP",chance:"BATTLE_TOAST_RECORD_CHANCE",recording:"STATUS_RECORDING_NAME",chooseSpecialisation:"UI_EVOLUTION_SPECIALIZATION",expPoints:"STAT_exp",viewMonsters:"UI_BESTIARY_LIST_MODE_VIEW_MONSTERS",viewStickers:"UI_PARTY_VIEW_MOVES",elementalTypeChart:"ITEM_TYPE_CHART_NAME",statusEffect:"MOVE_CATEGORY_STATUS",language:"TITLE_SCREEN_LANGUAGE_BUTTON",other:"UI_QUEST_LOG_SECTION_OTHER",applySticker:"UI_PARTY_APPLY_STICKER",stats:"UI_BESTIARY_INFO_TAB_STATS",passive:"UI_BUTTON_MOVE_PASSIVE",priorityChance:"STAT_priority_chance",humanForm:"UI_PARTY_STATS_CHARACTER",habitat:"UI_BESTIARY_INFO_TAB_LOCATION",unlockedAbility:"ABILITY_UNLOCKED",dlcPierOfTheUnknown:"DLC_01_PIER_NAME",attacker:"TYPE_CHART_ATTACKER",defender:"TYPE_CHART_DEFENDER",transmutation:"TYPE_CHART_TRANSMUTATION",noReaction:"TYPE_CHART_NO_REACTION",buffs:"TYPE_CHART_BUFFS",debuffs:"TYPE_CHART_DEBUFFS",map:"UI_PAUSE_MAP_BTN",typeless:"UI_INVENTORY_FILTER_TYPE_TYPELESS",cassetteBeasts:"MAIN_CREDITS_TITLE",homePageLongText1:"TUTORIAL_REMASTER",homePageLongText2:"TUTORIAL_RUMORS_DESCRIPTION1",fusion:"ONLINE_REQUEST_UI_BATTLE_RULES_REL_LEVEL",sameFusion1:"SAME_FUSION_NAME_1",sameFusion2:"SAME_FUSION_NAME_2",sameFusion3:"SAME_FUSION_NAME_3",sameFusion4:"SAME_FUSION_NAME_4",sameFusion5:"SAME_FUSION_NAME_5",sameFusion6:"SAME_FUSION_NAME_6",sameFusion7:"SAME_FUSION_NAME_7",sameFusion8:"SAME_FUSION_NAME_8",sameFusion9:"SAME_FUSION_NAME_9",fusionDescription1:"TUTORIAL4_PART3C_KAYLEIGH2",fusionDescription2:"TUTORIAL_BOSS_1.m",fusionDescription3:"TUTORIAL_FUSION1.m"};var M=(e=>(e[e.pending=0]="pending",e[e.loading=1]="loading",e[e.success=2]="success",e[e.error=3]="error",e))(M||{});const k=e=>{if((e??"").indexOf("res://")<0)return e;const r=(e??"").replace("res://","");return r.length<1?"/assets/img/passive_quest_icon.png?old="+e:`/assets/img/generated/${r}`};var J=T("<img loading=lazy>"),X=T("<p>"),ee=T("<summary data-todo=translate>❌ Something went wrong"),te=T("<summary>"),ne=T('<details class="monster dropdown"><!$><!/><ul>'),se=T("<summary data-todo=translate><!$><!/> Loading"),re=T('<div class="monster-option selected">'),ae=T('<li class="monster-option noselect">');const L=e=>{let r;const u=_=>[(()=>{var A=d(J);return P(p=>{var m=k(_.icon),v=_.name;return m!==p.e&&N(A,"src",p.e=m),v!==p.t&&N(A,"alt",p.t=v),p},{e:void 0,t:void 0}),A})(),(()=>{var A=d(X);return E(A,()=>_.name),A})()],o=_=>{r?.removeAttribute("open"),e.selectMonster(_)};return(()=>{var _=d(ne),A=_.firstChild,[p,m]=$(A.nextSibling),v=p.nextSibling,n=r;return typeof n=="function"?K(n,_):r=_,E(_,S(D,{get fallback(){return(()=>{var t=d(se),a=t.firstChild,[s,l]=$(a.nextSibling);return s.nextSibling,E(t,S(Y,{size:"sm"}),s,l),t})()},get children(){return[S(x,{get when(){return e.networkState===M.error},get children(){return d(ee)}}),S(x,{get when(){return e.networkState===M.success},get children(){var t=d(te);return E(t,(()=>{var a=B(()=>e.selectedMonster!=null);return()=>a()?(()=>{var s=d(re);return E(s,()=>u(e.selectedMonster)),s})():e.translate[Z.viewMonsters]})()),t}})]}}),p,m),E(v,()=>e.monsters.map(t=>(()=>{var a=d(ae);return a.$$click=()=>o(t),E(a,()=>u(t)),G(),a})())),_})()};j(["click"]);var ie=T('<h2 class="ta-center mt-1">');const oe=e=>{const[r,u]=h("");return U(()=>{if(e.monsterA==null&&e.monsterB==null){u("...");return}if(e.monsterA?.id==e.monsterB?.id){const o=(e.monsterA?.bestiary_index??0)%10,_=e.translate[`SAME_FUSION_NAME_${o+1}`];u(_.replace("{0}",e.monsterA?.name??""));return}u(`${e.monsterA?.prefix??"..."}${e.monsterB?.suffix??"..."}`)},[e.monsterA?.id,e.monsterB?.id]),(()=>{var o=d(ie);return E(o,r),o})()},le=e=>Math.max(e.lastIndexOf("\\"),e.lastIndexOf("/")),_e=e=>{const r=le(e);return e.substring(r+1)};var ue=T("<img class=fusion-node>");const me=e=>{const r=e.sizeMultiplier??3,u=e.fusion??{};if(u.visible==!1)return;const o=(n,t)=>{let a=n[t.name];if(a==null){const l=_e(t.instance_external_path??"").replace(".json","");a=n[l]}const s=a?.animations?.[0]?.frames?.[0];return{width:s?.width!=null?s.width*r+"px":"unset",height:s?.height!=null?s.height*r+"px":"unset"}},_=n=>n*r+"px",A=n=>{const t=n.instance_external_path??"",a=k(t.replace(".json",".png"));if((a?.length??0)!=0)return a},m=((n,t)=>{if(n==null)return;const a={...n};if((a?.parent?.length??0)!=0){const s=t[a.parent];if(s!=null){if(s.visible==!1)return;a.position.y=s.position.y,a.position.x=s.position.x}}return a})(u,e.fusionPartsList);if(m==null)return;const v=A(m);if(v!=null)return(()=>{var n=d(ue);return N(n,"src",v),P(t=>{var a=m.name,s=m.name,l=_(m.position.y),i=_(m.position.x),c=o(e.fusionSpriteMap,m).width,g=o(e.fusionSpriteMap,m).height,f=m.index??0;return a!==t.e&&N(n,"id",t.e=a),s!==t.t&&N(n,"alt",t.t=s),l!==t.a&&((t.a=l)!=null?n.style.setProperty("top",l):n.style.removeProperty("top")),i!==t.o&&((t.o=i)!=null?n.style.setProperty("left",i):n.style.removeProperty("left")),c!==t.i&&((t.i=c)!=null?n.style.setProperty("width",c):n.style.removeProperty("width")),g!==t.n&&((t.n=g)!=null?n.style.setProperty("height",g):n.style.removeProperty("height")),f!==t.s&&((t.s=f)!=null?n.style.setProperty("z-index",f):n.style.removeProperty("z-index")),t},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0}),n})()};var ce=T("<div class=fusion-item>"),ge=T('<div class="fusion-container mb-1">');const de=e=>{const[r,u]=h(),[o,_]=h(),[A,p]=h(0),[m,v]=h(0),[n,t]=h(1);U(()=>{if(e.fusionSpriteMap==null||e.itemMap==null)return;const s=e.itemMap[e.monsterA?.id??""];s!=null&&u(s.nodes_enhanced);const l=e.itemMap[e.monsterB?.id??""];l!=null&&_(l.nodes_enhanced);let i=0,c=0;for(const I of Object.values(e.fusionSpriteMap)){const O=I.animations[0].frames[0];O.height>i&&(i=O.height),O.width>c&&(c=O.width)}let g=0;for(const I of Object.values(s.nodes_enhanced))I.position.y<g&&(g=I.position.y);const f=screen.availHeight/2.5/i,y=screen.availWidth/2.5/c,R=Math.min(f,y);p(i),t(R),v(Math.abs(g)*R)},[e.monsterA?.id,e.monsterB?.id,e.fusionSpriteMap,e.itemMap]);const a=(s,l)=>{let i=[];for(const c of Object.values(s??{}))i.push(c);return i};return[S(oe,{get translate(){return e.translate},get monsterA(){return e.monsterA},get monsterB(){return e.monsterB}}),(()=>{var s=d(ge);return E(s,S(W,{get when(){return B(()=>r()!=null)()&&o()!=null},get children(){var l=d(ce);return E(l,()=>a(r(),o()).map(i=>S(me,{fusion:i,get fusionSpriteMap(){return e.fusionSpriteMap},get fusionPartsList(){return r()??{}},get sizeMultiplier(){return n()}}))),P(i=>{var c=`${m()}px`,g=n()*A()+"px",f=n()*A()+"px";return c!==i.e&&((i.e=c)!=null?l.style.setProperty("margin-top",c):l.style.removeProperty("margin-top")),g!==i.t&&((i.t=g)!=null?l.style.setProperty("height",g):l.style.removeProperty("height")),f!==i.a&&((i.a=f)!=null?l.style.setProperty("width",f):l.style.removeProperty("width")),i},{e:void 0,t:void 0,a:void 0}),l}})),s})()]};var Te=T('<article class="mb-1 warning"><div class="card ta-center">⚠️ This is a work in progress'),Ae=T("<summary data-todo=translate>❌ Something went wrong"),fe=T("<article class=mb-1><div class=fusion><div class=grid><!$><!/><!$><!/></div><!$><!/>"),Ee=T("<div class=fusion-container><div>");const pe=e=>{const[r,u]=h(),[o,_]=h(),[A,p]=h(),[m,v]=h(),[n,t]=h([]),[a,s]=h(M.loading),l=async()=>{const i=fetch(`/${C}/data/fusion.json`),c=fetch(`/${C}/data/fusionSpriteAnim.json`),g=fetch(`/${e.locale}/data/monsterDropDown.json`);try{const[f,y,R]=await Promise.all([i,c,g]),[I,O,F]=await Promise.all([f.json(),y.json(),R.json()]);p(I),v(O),t(F)}catch(f){console.log(f),s(M.error)}s(M.success)};return U(()=>{s(M.loading),l()},[]),[d(Te),(()=>{var i=d(fe),c=i.firstChild,g=c.firstChild,f=g.firstChild,[y,R]=$(f.nextSibling),I=y.nextSibling,[O,F]=$(I.nextSibling),H=g.nextSibling,[z,V]=$(H.nextSibling);return E(g,S(L,{get networkState(){return a()},get translate(){return e.translate},get monsters(){return n()},get selectedMonster(){return r()},selectMonster:u}),y,R),E(g,S(L,{get networkState(){return a()},get translate(){return e.translate},get monsters(){return n()},get selectedMonster(){return o()},selectMonster:_}),O,F),E(c,S(D,{get fallback(){return(()=>{var w=d(Ee),b=w.firstChild;return b.style.setProperty("margin","5vh auto"),E(b,S(Y,{size:"xl"})),w})()},get children(){return[S(x,{get when(){return a()===M.error},get children(){return d(Ae)}}),S(x,{get when(){return a()===M.success},get children(){return S(de,{get translate(){return e.translate},get itemMap(){return A()},get fusionSpriteMap(){return m()},get monsterA(){return r()},get monsterB(){return o()}})}})]}}),z,V),i})()]};export{pe as FusionPanel};
