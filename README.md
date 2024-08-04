<div align="center">
  
  # Cassette Beasts data extraction
  _A basic website for info about the game [Cassette Beasts][cassetteBeastWebsite]._
  
  <br />  
  
  ![header](https://github.com/AssistantApps/.github/blob/main/img/animatedBanner.svg?raw=true) 
  
  <br />
  
  ![madeWithLove](https://github.com/AssistantApps/.github/blob/main/badges/made-with-love.svg)
  ![gitmoji](https://github.com/AssistantApps/.github/blob/main/badges/gitmoji.svg?raw=true)<br />
  ![Profile views](https://komarev.com/ghpvc/?username=AssistantApps&color=green&style=for-the-badge)

[![Follow on Twitter](https://img.shields.io/badge/follow-%40AssistantApps-1d9bf0?logo=twitter&style=for-the-badge)][assistantAppsTwitter]
[![Discord](https://img.shields.io/discord/625007826913198080?style=for-the-badge)][discord]

  <br /> 
</div>

> [!NOTE]  
> This project is not intended to replace or compete with the [Cassette Beasts Wiki][cassetteBeastWiki]! The wiki contributors are doing an amazing job and the wiki is far better for information that is added manually (such as trivia, additional info, etc). This tool is focused on representing what is in the game files accurately!

<br />

## About

At the beginning of July 2024, I ([Kurt][khaozTopsyGithub]) was playing a lot of [Cassette Beasts][cassetteBeastWebsite] and really enjoying it. I started to worry that I was going to finish the game soon so I decided to make a little project to work on that is [Cassette Beasts][cassetteBeastWebsite] related and delay my progress on the game, at least for a little while.

This project was designed to be as automated as possible, to make the burden of keeping the data up to date as little as possible. The first step was to learn how to decompile a Godot project and extract the data from the game. Thankfully this was quite straight forward (especially compared to games such as No Man's Sky or Dinkum).

<br />

## 💖 Favourite features 💖

- Creating animated images (~~GIFs~~ WebP!)
  - The first challenge was to cut out individual frames from the spriteSheets (e.g. [allseer.sheet.png](public\assets\img\generated\sprites\monsters\allseer.sheet.png)). Many of the monsters/characters/etc are different sizes, so the frame size needed to be extracted from the individual monster/character/etc files (e.g. line 29 on [allseer.txt](misc\allseer.txt))
  - ~~I made use of [gif-encoder-2][nmpjsGifEncoder2] to combine these frames into GIFs. I had some issues with the format of the PNGs in the decompiled game files and needed to run the images through [sharp][npmjsSharp] first to ensure the frame was in the correct format for [gif-encoder-2][nmpjsGifEncoder2].~~
  - After the many issues (even after a lot of tweaking) I was unable to get good quality GIFs from [gif-encoder-2][nmpjsGifEncoder2], there were a lot of issues with transparency of the GIFs and so I looked towards generating the animated images in WebP format. Making use of [webpmux][webpmux] (by including the binary in this project 😅) I am able to pass the animation frames in WebP format (thanks again [sharp][npmjsSharp]) to the [webpmux][webpmux] binary and output an animated WebP image to be used in the website 🥳.
- All the meta tags! I made heavy use of the meta tags that are available and this should not only give the website a great SEO score but also have better accessability and screen reader support.
- Generating images for meta and fun
  - The image that shows up when sharing a link in Discord, Slack, Twitter, Whatsapp, etc.
  - This was achieved by using HandlebarJS to create an SVG and then converting that SVG to PNG
- Parsing the game files for example [allseer.tres](misc\allseer.tres)
  - This was quite tricky because it was new to me and JS/TS is not the right tool for this

<br />

## Data extraction

[Here are some basic instructions to get started](misc\extractGameFile.md). The unpacking process is quite smooth, although there are a handful of files that need to be converted from binary to text using [Godot RE Tools](https://github.com/bruvzg/gdsdecomp/releases). I would love to automate this process, the only thing holding me back with the current way I am unpacking the files is that I need to use the GUI of the [Godot RE Tool](https://github.com/bruvzg/gdsdecomp/releases). If you have a better way of unpacking the game files please reach out!

<br />

## Image extraction

This was quite a challenge, the images for the monsters are in a "sprite sheet" (e.g. [allseer.sheet.png](./public/assets/img/generated/sprites/monsters/allseer.sheet.png)). Originally I assumed that all monsters were the same size and attempted to cut out the first frame the same way for each image. It turns out that there are many different sizes used for the monster's "sprite sheets". Luckily I did find the coordinates for the animations per monster in the game files. I was able to cut out the first frame consistently per monster (e.g. [allseer.png](./public/assets/img/generated/sprites/monsters/allseer.png)) and later, with the help of [webpmux][webpmux], I was able to create WebPs of each of the animations per monster 🎉 (e.g. [allseer.anim1.webp](./public/assets/img/generated/sprites/monsters/allseer.anim1.webp)).

<br />

## Why ~~[HandlebarJS][handlebarJS]~~ [Astro][astro]?

This was purely a personal choice, I am a a bit tired of using client-side javascript frameworks and I wanted to mess around with more "pure" html and javascript, however I really did not want to craft each an every page manually. So [HandlebarJS][handlebarJS] was perfectly suited for letting me write HTML while allowing for automation. Soon after launching the site I started a new project using [Astro][astro] and I was so impressed that I decided to convert this whole project to [Astro][astro] 😅. [Astro][astro] provides a much better developer experience, although a lot of the control is taken away from me.

### Other tech choices

- SolidJS
  - I like SolidJS because of how similar it is to React and it improves on a lot of aspects I dislike about React. [Astro][astro] allows me to have parts of my site use whatever JS framework I want.
- SCSS
  - I am not as big of a fan of writing "pure" css, so I used scss to generate the css and I made use of [Pico][picoCssWebsite] for the base styling of the website.

<br />
<br />

---

By using the software and services provided, you agree to our [Terms and conditions][cassetteBeastTerms], [Privacy Policy][cassetteBeastPrivacy], and [Code of Conduct][cassetteBeastCodeOfConduct].

<br />
<br />

[cassetteBeastWebsite]: https://www.cassettebeasts.com?ref=AssistantAppsCBGithub
[cassetteBeastPrivacy]: https://www.cassettebeasts.assistantapps.com/privacy_policy.html?ref=AssistantAppsCBGithub
[cassetteBeastTerms]: https://www.cassettebeasts.assistantapps.com/terms_and_conditions.html?ref=AssistantAppsCBGithub
[cassetteBeastCodeOfConduct]: https://github.com/AssistantApps/CassetteBeasts?tab=coc-ov-file#readme
[cassetteBeastWiki]: https://wiki.cassettebeasts.com?ref=AssistantAppsCBGithub
[handlebarJS]: https://handlebarsjs.com?ref=AssistantAppsCBGithub
[astro]: https://astro.build?ref=AssistantAppsCBGithub
[webpmux]: https://developers.google.com/speed/webp/docs/webpmux?ref=AssistantAppsCBGithub
[nmpjsGifEncoder2]: https://www.npmjs.com/package/gif-encoder?ref=AssistantAppsCBGithub
[npmjsSharp]: https://www.npmjs.com/package/sharp?ref=AssistantAppsCBGithub
[picoCssWebsite]: https://picocss.com?ref=AssistantAppsCBGithub
[khaozTopsyGithub]: https://github.com/Khaoz-Topsy?ref=AssistantAppsCBGithub
[assistantAppsTwitter]: https://twitter.com/AssistantApps?ref=AssistantAppsCBGithub
[discord]: https://assistantapps.com/discord?ref=AssistantAppsCBGithub
