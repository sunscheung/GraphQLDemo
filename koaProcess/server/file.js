const fs = require('fs');
const path = require('path');
const unzip = require('unzipper');

const dir = path.parse(process.cwd());

const rootPath = path.resolve(dir.dir, dir.base, 'static');
async function FileProcess(ctx, next) {
  // console.log('req', ctx.request.body); 
  // console.log('path', path.parse(process.cwd()));
  const body = ctx.request.body;
  const file=ctx.request.files.file;

  const content = fs.createReadStream(file.path);
  // const target = fs.createWriteStream
  await next();
  console.log('path', rootPath, body);     
  // const stream = fs.createWriteStream(path.join(rootPath, `${file.name}`)); // `${file.name}`
  // content.pipe(stream);

  // const zipstream = fs.createReadStream(path.join(rootPath, `${file.name}`)); // `${file.name}`

  const distFilePath = path.join(rootPath, file.name.replace(/\.[a-z-A-Z]+$/, ''));
  fs.exists(distFilePath, (isExist) => {
    console.log('is', isExist);
    if (!isExist) {
      fs.mkdirSync(distFilePath);
    }
    content
    .pipe(unzip.Extract({ path: distFilePath }));
   
    console.log('ok', file.name);  
  }); 
  ctx.body = JSON.stringify({ status: 'ok', code: 200 });
}

module.exports = FileProcess;