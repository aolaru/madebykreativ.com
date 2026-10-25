// Import only public tutorial images and reviewed article copy, never the internal marketing pack.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const pack=resolve(process.argv[2]||'../Utility apps/photofeather/promotion/2026-10-25');
const manifest=JSON.parse(await readFile(join(pack,'sources/provenance.json'),'utf8'));
const tutorial='public/images/photofeather/tutorial',app='public/apps/photofeather';
await mkdir(tutorial,{recursive:true});await mkdir(app,{recursive:true});
for(const entry of manifest.files.slice(0,5)){
 const bytes=await readFile(join(pack,'tutorial/screenshots',entry.file+'.png'));
 if(createHash('sha256').update(bytes).digest('hex')!==entry.tutorialSha256)throw Error('Screenshot hash mismatch: '+entry.file);
 await writeFile(join(tutorial,entry.file+'.png'),bytes);
 for(const width of [480,960])await sharp(bytes).resize({width,withoutEnlargement:true}).webp({quality:86}).toFile(join(tutorial,entry.file+`-${width}.webp`));
}
await copyFile(join(tutorial,'01-select-photos.png'),join(app,'screen.png'));
for(const width of [320,640,1080])await sharp(join(app,'screen.png')).resize({width}).webp({quality:84}).toFile(join(app,`screen-${width}.webp`));
// Website icon follows the app's checked-in Android vector, not an AI-generated bitmap.
const iconSvg='<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 108 108"><rect width="108" height="108" rx="24" fill="#226B5A"/><path fill="#fff" d="M72,26 C51,24 35,36 37,56 L47,67 C67,65 78,46 72,26 Z"/><path fill="none" stroke="#226B5A" stroke-width="2.5" stroke-linecap="round" d="M33,76 L64,36 M48,56 L48,43 M55,47 L67,47 M41,64 L54,64"/></svg>';
await writeFile(join(app,'icon.svg'),iconSvg);await sharp(Buffer.from(iconSvg)).png().toFile(join(app,'icon.png'));
await sharp(Buffer.from('<svg width="1200" height="630"><rect width="1200" height="630" fill="#f4f7f1"/><text x="70" y="105" fill="#256e5e" font-family="Arial" font-size="28">PHOTOFEATHER · MADE BY KREATIV</text><text x="70" y="260" fill="#173f37" font-family="Arial" font-weight="bold" font-size="68">Lighter photos.</text><text x="70" y="345" fill="#173f37" font-family="Arial" font-weight="bold" font-size="68">Ready to share.</text><text x="70" y="480" fill="#50675e" font-family="Arial" font-size="27">Compress. Resize. Check the result.</text><text x="70" y="550" fill="#256e5e" font-family="Arial" font-size="25">On your Android device. Originals untouched.</text></svg>')).composite([{input:await sharp(join(app,'screen.png')).resize({height:530}).png().toBuffer(),left:830,top:50}]).png().toFile(join(app,'social.png'));
await writeFile(join(app,'source.json'),JSON.stringify({checked:'2026-10-25',listing:manifest.store,version:manifest.version,icon:'Rendered from photofeather/app/src/main/res/drawable/launcher_foreground.xml with a code-built background; not a downloaded store icon.',screenshot:manifest.files[0],tutorial:manifest.files.slice(0,5)},null,2)+'\n');
let article=await readFile(join(pack,'tutorial/article-body.html'),'utf8');
article=article.replace(/<figure><img src="screenshots\/([^"]+)"([^>]+)><figcaption>([^<]+)<\/figcaption><\/figure>/g,(_,name,attrs,caption)=>`<figure class="tutorial-screenshot"><a href="/images/photofeather/tutorial/${name}"><img src="/images/photofeather/tutorial/${name}" srcset="/images/photofeather/tutorial/${name.replace('.png','-480.webp')} 480w, /images/photofeather/tutorial/${name.replace('.png','-960.webp')} 960w" sizes="(max-width: 600px) calc(100vw - 4rem), 480px" decoding="async"${attrs} /></a><figcaption>${caption}</figcaption></figure>`);
let cta=0;article=article.replace(/https:\/\/play.google.com\/store\/apps\/details\?id=com.kreativ.photofeather/g,url=>{const u=new URL(url);u.searchParams.set('utm_source','madebykreativ');u.searchParams.set('utm_medium','website');u.searchParams.set('utm_campaign','photofeather_launch_202610');u.searchParams.set('utm_content',cta++?'tutorial_footer':'tutorial_intro');return u.href.replaceAll('&','&amp;')});
article+='\n<p><a href="/apps/photofeather/">Explore PhotoFeather</a></p>\n';
await writeFile('src/content/news/compress-photos-android-photofeather.md','---\ntitle: "How to compress and resize photos on Android with PhotoFeather"\ndescription: "Prepare photos for upload limits, choose resize presets, inspect measured sizes and save new JPEG copies with PhotoFeather."\ndateLabel: "October 25, 2026"\nsortDate: 2026-10-25\ncategory: "Product"\napp: "photofeather"\n---\n\n'+article);
console.log('Imported five public screenshots, app artwork and reviewed tutorial copy.');
