import{r as l}from"./index.DhYZZe0J.js";var F={exports:{}},x={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var L=l,y=Symbol.for("react.element"),P=Symbol.for("react.fragment"),B=Object.prototype.hasOwnProperty,C=L.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,D={key:!0,ref:!0,__self:!0,__source:!0};function v(e,s,o){var a,n={},_=null,g=null;o!==void 0&&(_=""+o),s.key!==void 0&&(_=""+s.key),s.ref!==void 0&&(g=s.ref);for(a in s)B.call(s,a)&&!D.hasOwnProperty(a)&&(n[a]=s[a]);if(e&&e.defaultProps)for(a in s=e.defaultProps,s)n[a]===void 0&&(n[a]=s[a]);return{$$typeof:y,type:e,key:_,ref:g,props:n,_owner:C.current}}x.Fragment=P;x.jsx=v;x.jsxs=v;F.exports=x;var t=F.exports;const b={logoSplash:"/assets/img/evo_splash_04.png",cardLoader:"/assets/img/cardLoader.svg",loader:"/assets/img/loader.svg",noLoader:"/assets/img/noLoader.svg",typeless:"/assets/img/typeless.png",moreStatusEffects:"/assets/img/passive_quest_icon.png",moves:"/assets/img/moves.png",characters:"/assets/img/characters.png",meta:"/assets/img/meta/meta_tape_default.png",metaTapeBg:"/assets/img/meta/meta_tape_bg.png",metaTapeBootlegBg:"/assets/img/meta/meta_tape_bootleg_bg.png",metaTapeOverlay:"/assets/img/meta/meta_tape_overlay.png",metaAp:"/assets/img/meta/ap.png",metaApx:"/assets/img/meta/ap-x.png",characterBg:"/assets/img/meta/character_bg.png",overworldBg:"/assets/img/game/data/map_metadata/overworld.png",tapeBg:"/assets/img/meta/tape.png",tapeBootlegBg:"/assets/img/meta/tape_bootleg.png",tapeOverlay:"/assets/img/meta/tape_overlay.png",unknown:"/assets/img/passive_quest_icon.png"},w=e=>{let s=3;switch(e.size){case"xs":s=1;break;case"sm":s=2;break;case"md":s=3;break;case"lg":s=6;break;case"xl":s=12;break}const o=`${s*8}px`;return t.jsx("img",{src:b.loader,className:"noselect",style:{width:o,height:o},draggable:"false",alt:"loading"})},N="en",Y={remaster:"UI_EVOLUTION_TITLE",stickers:"UI_PARTY_STICKERS",maxHP:"SHORT_NAME_max_hp",mAtk:"SHORT_NAME_melee_attack",mDef:"SHORT_NAME_melee_defense",rAtk:"SHORT_NAME_ranged_attack",rDef:"SHORT_NAME_ranged_defense",speed:"SHORT_NAME_speed",elementalType:"UI_INVENTORY_FILTER_TYPE",name:"UI_INVENTORY_FILTER_NAME",category:"UI_INVENTORY_FILTER_CATEGORY",power:"MOVE_DESCRIPTION_POWER",accuracy:"STAT_accuracy",evasion:"STAT_evasion",maxAP:"STAT_max_ap",moveSlots:"STAT_move_slots",ap:"BATTLE_TOAST_AP",chance:"BATTLE_TOAST_RECORD_CHANCE",recording:"STATUS_RECORDING_NAME",chooseSpecialisation:"UI_EVOLUTION_SPECIALIZATION",expPoints:"STAT_exp",viewMonsters:"UI_BESTIARY_LIST_MODE_VIEW_MONSTERS",viewStickers:"UI_PARTY_VIEW_MOVES",elementalTypeChart:"ITEM_TYPE_CHART_NAME",statusEffect:"MOVE_CATEGORY_STATUS",language:"TITLE_SCREEN_LANGUAGE_BUTTON",other:"UI_QUEST_LOG_SECTION_OTHER",applySticker:"UI_PARTY_APPLY_STICKER",stats:"UI_BESTIARY_INFO_TAB_STATS",passive:"UI_BUTTON_MOVE_PASSIVE",priorityChance:"STAT_priority_chance",humanForm:"UI_PARTY_STATS_CHARACTER",habitat:"UI_BESTIARY_INFO_TAB_LOCATION",unlockedAbility:"ABILITY_UNLOCKED",dlcPierOfTheUnknown:"DLC_01_PIER_NAME",attacker:"TYPE_CHART_ATTACKER",defender:"TYPE_CHART_DEFENDER",transmutation:"TYPE_CHART_TRANSMUTATION",noReaction:"TYPE_CHART_NO_REACTION",buffs:"TYPE_CHART_BUFFS",debuffs:"TYPE_CHART_DEBUFFS",map:"UI_PAUSE_MAP_BTN",typeless:"UI_INVENTORY_FILTER_TYPE_TYPELESS",cassetteBeasts:"MAIN_CREDITS_TITLE",homePageLongText1:"TUTORIAL_REMASTER",homePageLongText2:"TUTORIAL_RUMORS_DESCRIPTION1",fusion:"ONLINE_REQUEST_UI_BATTLE_RULES_REL_LEVEL",sameFusion1:"SAME_FUSION_NAME_1",sameFusion2:"SAME_FUSION_NAME_2",sameFusion3:"SAME_FUSION_NAME_3",sameFusion4:"SAME_FUSION_NAME_4",sameFusion5:"SAME_FUSION_NAME_5",sameFusion6:"SAME_FUSION_NAME_6",sameFusion7:"SAME_FUSION_NAME_7",sameFusion8:"SAME_FUSION_NAME_8",sameFusion9:"SAME_FUSION_NAME_9",fusionDescription1:"TUTORIAL4_PART3C_KAYLEIGH2",fusionDescription2:"TUTORIAL_BOSS_1.m",fusionDescription3:"TUTORIAL_FUSION1.m"},U=e=>{if((e??"").indexOf("res://")<0)return e??"";const s=(e??"").replace("res://","");return s.length<1?"/assets/img/passive_quest_icon.png?orig="+e:`/assets/img/generated/${s}`},R=e=>{let s=l.createRef();const o=n=>t.jsxs(t.Fragment,{children:[t.jsx("img",{src:U(n.icon),alt:n.name,loading:"lazy"}),t.jsx("p",{children:n.name})]}),a=n=>{s!=null&&s.current!=null&&s.current.removeAttribute("open"),e.selectMonster(n)};return t.jsxs("details",{ref:s,className:"monster dropdown",children:[t.jsx("summary",{children:e.selectedMonster!=null?t.jsx("div",{className:"monster-option selected",children:o(e.selectedMonster)}):e.translate[Y.viewMonsters]}),t.jsx("ul",{children:e.monsters.map(n=>t.jsx("li",{className:"monster-option noselect",onClick:()=>a(n),children:o(n)},n.id))})]})},H=e=>{const[s,o]=l.useState("");return l.useEffect(()=>{if(e.monsterA==null&&e.monsterB==null){o("...");return}if(e.monsterA?.id==e.monsterB?.id){const a=(e.monsterA?.bestiary_index??0)%10,n=e.translate[`SAME_FUSION_NAME_${a+1}`];o(n.replace("{0}",e.monsterA?.name??""));return}o(`${e.monsterA?.prefix??"..."}${e.monsterB?.suffix??"..."}`)},[e.monsterA?.id,e.monsterB?.id]),t.jsx("h2",{className:"ta-center mt-1",children:s})},k=e=>Math.max(e.lastIndexOf("\\"),e.lastIndexOf("/")),z=e=>{const s=k(e);return e.substring(s+1)},V=e=>{const s=e.sizeMultiplier??3,o=e.fusion??{};if(o.visible==!1)return;const a=(c,u)=>{let r=c[u.name];if(r==null){const A=z(u.instance_external_path??"").replace(".json","");r=c[A]}const i=r?.animations?.[0]?.frames?.[0];return{width:i?.width!=null?i.width*s+"px":"unset",height:i?.height!=null?i.height*s+"px":"unset"}},n=c=>c*s+"px",_=c=>{const u=c.instance_external_path??"",r=U(u.replace(".json",".png"));if((r?.length??0)!=0)return r},m=((c,u)=>{if(c==null)return;const r={...c};if((r?.parent?.length??0)!=0){const i=u[r.parent];if(i!=null){if(i.visible==!1)return;r.position.y=i.position.y,r.position.x=i.position.x}}return r})(o,e.fusionPartsList);if(m==null)return;const E=_(m);if(E!=null)return t.jsx("img",{id:m.name,src:E,alt:m.name,className:"fusion-node",style:{top:n(m.position.y),left:n(m.position.x),width:a(e.fusionSpriteMap,m).width,height:a(e.fusionSpriteMap,m).height,zIndex:m.index??0}})},$=e=>{const[s,o]=l.useState(),[a,n]=l.useState(),[_,g]=l.useState(0),[m,E]=l.useState(0),[c,u]=l.useState(1);l.useEffect(()=>{if(e.fusionSpriteMap==null||e.itemMap==null)return;const i=e.itemMap[e.monsterA?.id??""];i!=null&&o(i.nodes_enhanced);const A=e.itemMap[e.monsterB?.id??""];A!=null&&n(A.nodes_enhanced);let d=0,f=0;for(const S of Object.values(e.fusionSpriteMap??{})){const p=S.animations[0].frames[0];p.height>d&&(d=p.height),p.width>f&&(f=p.width)}let I=0;for(const S of Object.values(i?.nodes_enhanced??{}))S.position.y<I&&(I=S.position.y);const h=screen.availHeight/2.5/d,O=screen.availWidth/2.5/f,M=Math.min(h,O);g(d),u(M),E(Math.abs(I)*M)},[e.monsterA?.id,e.monsterB?.id,e.fusionSpriteMap,e.itemMap]);const r=(i,A)=>{let d=[];for(const f of Object.values(i??{}))d.push(f);return d};return t.jsxs(t.Fragment,{children:[t.jsx(H,{translate:e.translate,monsterA:e.monsterA,monsterB:e.monsterB}),t.jsx("div",{className:"fusion-container mb-1",children:s!=null&&a!=null&&t.jsx("div",{className:"fusion-item",style:{marginTop:`${m}px`,height:c*_+"px",width:c*_+"px"},children:r(s).map(i=>t.jsx(V,{fusion:i,fusionSpriteMap:e.fusionSpriteMap,fusionPartsList:s??{},sizeMultiplier:c},i.name))})})]})};var T=(e=>(e[e.pending=0]="pending",e[e.loading=1]="loading",e[e.success=2]="success",e[e.error=3]="error",e))(T||{});const W=e=>{const[s,o]=l.useState(),[a,n]=l.useState(),[_,g]=l.useState({}),[m,E]=l.useState({}),[c,u]=l.useState([]),[r,i]=l.useState(T.loading),A=async()=>{const d=fetch(`/${N}/data/fusion.json`),f=fetch(`/${N}/data/fusionSpriteAnim.json`),I=fetch(`/${e.locale}/data/monsterDropDown.json`);try{const[h,O,M]=await Promise.all([d,f,I]),[S,p,j]=await Promise.all([h.json(),O.json(),M.json()]);g(S),E(p),u(j)}catch(h){console.log(h),i(T.error)}i(T.success)};return l.useEffect(()=>{A()},[]),t.jsxs(t.Fragment,{children:[t.jsx("article",{className:"mb-1 warning",children:t.jsx("div",{className:"card ta-center",children:"⚠️ This is a work in progress"})}),t.jsx("article",{className:"mb-1",children:t.jsxs("div",{className:"fusion",children:[(r===T.loading||r===T.pending)&&t.jsx("div",{className:"fusion-container",children:t.jsx("div",{style:{margin:"5vh auto"},children:t.jsx(w,{size:"xl"})})}),r===T.error&&t.jsx("summary",{"data-TODO":"translate",children:"❌ Something went wrong"}),r===T.success&&t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:"grid",children:[t.jsx(R,{translate:e.translate,monsters:c,selectedMonster:s,selectMonster:o}),t.jsx(R,{translate:e.translate,monsters:c,selectedMonster:a,selectMonster:n})]}),t.jsx($,{translate:e.translate,itemMap:_,fusionSpriteMap:m,monsterA:s,monsterB:a})]})]})})]})};export{W as FusionPanel};
