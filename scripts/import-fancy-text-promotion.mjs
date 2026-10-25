// Publish only reviewed tutorial copy, verified interface screenshots and the app icon.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
const appRoot=resolve(process.argv[2]||'../Utility apps/kreativ-fancy-text');
const pack=join(appRoot,'promotion/2026-10-25'),graphics=join(appRoot,'store/graphics');
const manifest=JSON.parse(await readFile(join(graphics,'manifest.json'),'utf8'));
const tutorial='public/images/kreativ-fancy-text/tutorial',app='public/apps/kreativ-fancy-text';
await mkdir(tutorial,{recursive:true});await mkdir(app,{recursive:true});
for(const entry of manifest.assets.filter(a=>a.file.startsWith('screenshots/')||a.file==='icon-512.png')){
 const bytes=await readFile(join(graphics,entry.file));
 if(createHash('sha256').update(bytes).digest('hex')!==entry.sha256)throw Error('Asset hash mismatch: '+entry.file);
 await writeFile(entry.file==='icon-512.png'?join(app,'icon.png'):join(tutorial,entry.file.slice('screenshots/'.length)),bytes);
}
await copyFile(join(tutorial,'01-create.png'),join(app,'screen.png'));
await copyFile(join(appRoot,'public/icon.svg'),join(app,'icon.svg'));
await writeFile(join(app,'source.json'),JSON.stringify({checked:'2026-10-25',listing:'https://play.google.com/store/apps/details?id=com.kreativfont.studio',version:manifest.version,capture:'Actual bundled 1.0.1 interface in Chromium at 432x768 CSS px and 2.5x scale. Not physical-phone screenshots. Native clipboard/file/share dialogs not depicted.',icon:'Existing brand SVG rendered for the Play store icon.',assets:manifest.assets.filter(a=>a.file.startsWith('screenshots/')||a.file==='icon-512.png')},null,2)+'\n');
let article=await readFile(join(pack,'tutorial/article-body.html'),'utf8');
article=article.replace(/<figure><img src="screenshots\/([^"]+)"([^>]+)><figcaption>([^<]+)<\/figcaption><\/figure>/g,(_,name,attrs,caption)=>`<figure class="tutorial-screenshot"><a href="/images/kreativ-fancy-text/tutorial/${name}"><img src="/images/kreativ-fancy-text/tutorial/${name}" srcset="/images/kreativ-fancy-text/tutorial/${name.replace('.png','-480.webp')} 480w, /images/kreativ-fancy-text/tutorial/${name.replace('.png','-960.webp')} 960w" sizes="(max-width: 600px) calc(100vw - 4rem), 480px" decoding="async"${attrs} /></a><figcaption>${caption}</figcaption></figure>`);
let cta=0;article=article.replace(/https:\/\/play.google.com\/store\/apps\/details\?id=com.kreativfont.studio/g,url=>{const u=new URL(url);u.searchParams.set('utm_source','madebykreativ');u.searchParams.set('utm_medium','website');u.searchParams.set('utm_campaign','fancytext_launch_202610');u.searchParams.set('utm_content',cta++?'tutorial_footer':'tutorial_intro');return u.href.replaceAll('&','&amp;')});
article+='\n<p><a href="/apps/kreativ-fancy-text/">Explore Kreativ Fancy Text</a></p>\n';
await writeFile('src/content/news/fancy-text-png-designs-android-kreativ.md','---\ntitle: "How to create fancy text and PNG designs on Android"\ndescription: "Style individual words, copy Unicode text, export PNG artwork and save local designs with Kreativ Fancy Text."\ndateLabel: "October 25, 2026"\nsortDate: 2026-10-25\ncategory: "Product"\napp: "kreativ-fancy-text"\n---\n\n'+article);
console.log('Imported the reviewed Fancy Text tutorial, five verified screenshots and brand icon.');
