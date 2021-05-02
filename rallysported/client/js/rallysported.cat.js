// WHAT: Concatenated JavaScript source files
// PROGRAM: RallySportED-js
// AUTHOR: Tarpeeksi Hyvae Soft
// VERSION: live (02 May 2021 05:54:29 UTC)
// LINK: https://www.github.com/leikareipa/rallysported-js/
// INCLUDES: { JSZip (c) 2009-2016 Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso }
// INCLUDES: { FileSaver.js (c) 2016 Eli Grey }
// INCLUDES: { The retro n-gon renderer (c) 2019-2020 Tarpeeksi Hyvae Soft }
// FILES:
//	./src/client/js/jszip/jszip.min.js
//	./src/client/js/filesaver/FileSaver.min.js
//	./src/client/js/retro-ngon/rngon.cat.js
//	./src/client/js/rallysported-js/rallysported.js
//	./src/client/js/rallysported-js/ui/ui.js
//	./src/client/js/rallysported-js/ui/popup-notification.js
//	./src/client/js/rallysported-js/misc/browser-metadata.js
//	./src/client/js/rallysported-js/misc/uuidgen.js
//	./src/client/js/rallysported-js/misc/rngon-minimal-fill.js
//	./src/client/js/rallysported-js/misc/rngon-minimal-tcl.js
//	./src/client/js/rallysported-js/player/player.js
//	./src/client/js/rallysported-js/project/project.js
//	./src/client/js/rallysported-js/project/hitable.js
//	./src/client/js/rallysported-js/misc/constants.js
//	./src/client/js/rallysported-js/world/world.js
//	./src/client/js/rallysported-js/world/mesh-builder.js
//	./src/client/js/rallysported-js/world/camera.js
//	./src/client/js/rallysported-js/visual/texture.js
//	./src/client/js/rallysported-js/visual/palette.js
//	./src/client/js/rallysported-js/visual/canvas.js
//	./src/client/js/rallysported-js/track/varimaa.js
//	./src/client/js/rallysported-js/track/maasto.js
//	./src/client/js/rallysported-js/track/kierros.js
//	./src/client/js/rallysported-js/track/palat.js
//	./src/client/js/rallysported-js/track/props.js
//	./src/client/js/rallysported-js/ui/asset-mutator.js
//	./src/client/js/rallysported-js/ui/undo-stack.js
//	./src/client/js/rallysported-js/ui/html.js
//	./src/client/js/rallysported-js/ui/font.js
//	./src/client/js/rallysported-js/ui/ground-brush.js
//	./src/client/js/rallysported-js/ui/cursor-handler.js
//	./src/client/js/rallysported-js/ui/draw.js
//	./src/client/js/rallysported-js/ui/window.js
//	./src/client/js/rallysported-js/ui/input-state.js
//	./src/client/js/rallysported-js/ui/mouse-picking-element.js
//	./src/client/js/rallysported-js/ui/component.js
//	./src/client/js/rallysported-js/ui/components/active-pala.js
//	./src/client/js/rallysported-js/ui/components/fps-indicator.js
//	./src/client/js/rallysported-js/ui/components/ground-hover-info.js
//	./src/client/js/rallysported-js/ui/components/palat-pane.js
//	./src/client/js/rallysported-js/ui/components/tilemap-minimap.js
//	./src/client/js/rallysported-js/ui/components/color-selector.js
//	./src/client/js/rallysported-js/ui/components/label.js
//	./src/client/js/rallysported-js/scene/scene.js
//	./src/client/js/rallysported-js/scene/scene-3d.js
//	./src/client/js/rallysported-js/scene/scene-tilemap.js
//	./src/client/js/rallysported-js/scene/scene-texture.js
//	./src/client/js/rallysported-js/stream/stream.js
//	./src/client/js/rallysported-js/stream/server.js
//	./src/client/js/rallysported-js/stream/streamer.js
//	./src/client/js/rallysported-js/stream/viewer.js
//	./src/client/js/rallysported-js/core/core.js
/////////////////////////////////////////////////
/*!
JSZip v3.1.5 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>
(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.
JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b.JSZip=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d=a("./utils"),e=a("./support"),f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,g,h,i,j,k=[],l=0,m=a.length,n=m,o="string"!==d.getTypeOf(a);l<a.length;)n=m-l,o?(b=a[l++],c=l<m?a[l++]:0,e=l<m?a[l++]:0):(b=a.charCodeAt(l++),c=l<m?a.charCodeAt(l++):0,e=l<m?a.charCodeAt(l++):0),g=b>>2,h=(3&b)<<4|c>>4,i=n>1?(15&c)<<2|e>>6:64,j=n>2?63&e:64,k.push(f.charAt(g)+f.charAt(h)+f.charAt(i)+f.charAt(j));return k.join("")},c.decode=function(a){var b,c,d,g,h,i,j,k=0,l=0,m="data:";if(a.substr(0,m.length)===m)throw new Error("Invalid base64 input, it looks like a data url.");a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");var n=3*a.length/4;if(a.charAt(a.length-1)===f.charAt(64)&&n--,a.charAt(a.length-2)===f.charAt(64)&&n--,n%1!==0)throw new Error("Invalid base64 input, bad content length.");var o;for(o=e.uint8array?new Uint8Array(0|n):new Array(0|n);k<a.length;)g=f.indexOf(a.charAt(k++)),h=f.indexOf(a.charAt(k++)),i=f.indexOf(a.charAt(k++)),j=f.indexOf(a.charAt(k++)),b=g<<2|h>>4,c=(15&h)<<4|i>>2,d=(3&i)<<6|j,o[l++]=b,64!==i&&(o[l++]=c),64!==j&&(o[l++]=d);return o}},{"./support":30,"./utils":32}],2:[function(a,b,c){"use strict";function d(a,b,c,d,e){this.compressedSize=a,this.uncompressedSize=b,this.crc32=c,this.compression=d,this.compressedContent=e}var e=a("./external"),f=a("./stream/DataWorker"),g=a("./stream/DataLengthProbe"),h=a("./stream/Crc32Probe"),g=a("./stream/DataLengthProbe");d.prototype={getContentWorker:function(){var a=new f(e.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new g("data_length")),b=this;return a.on("end",function(){if(this.streamInfo.data_length!==b.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),a},getCompressedWorker:function(){return new f(e.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},d.createWorkerFrom=function(a,b,c){return a.pipe(new h).pipe(new g("uncompressedSize")).pipe(b.compressWorker(c)).pipe(new g("compressedSize")).withStreamInfo("compression",b)},b.exports=d},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(a,b,c){"use strict";var d=a("./stream/GenericWorker");c.STORE={magic:"\0\0",compressWorker:function(a){return new d("STORE compression")},uncompressWorker:function(){return new d("STORE decompression")}},c.DEFLATE=a("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(a,b,c){"use strict";function d(){for(var a,b=[],c=0;c<256;c++){a=c;for(var d=0;d<8;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function e(a,b,c,d){var e=h,f=d+c;a^=-1;for(var g=d;g<f;g++)a=a>>>8^e[255&(a^b[g])];return a^-1}function f(a,b,c,d){var e=h,f=d+c;a^=-1;for(var g=d;g<f;g++)a=a>>>8^e[255&(a^b.charCodeAt(g))];return a^-1}var g=a("./utils"),h=d();b.exports=function(a,b){if("undefined"==typeof a||!a.length)return 0;var c="string"!==g.getTypeOf(a);return c?e(0|b,a,a.length,0):f(0|b,a,a.length,0)}},{"./utils":32}],5:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.createFolders=!0,c.date=null,c.compression=null,c.compressionOptions=null,c.comment=null,c.unixPermissions=null,c.dosPermissions=null},{}],6:[function(a,b,c){"use strict";var d=null;d="undefined"!=typeof Promise?Promise:a("lie"),b.exports={Promise:d}},{lie:58}],7:[function(a,b,c){"use strict";function d(a,b){h.call(this,"FlateWorker/"+a),this._pako=null,this._pakoAction=a,this._pakoOptions=b,this.meta={}}var e="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,f=a("pako"),g=a("./utils"),h=a("./stream/GenericWorker"),i=e?"uint8array":"array";c.magic="\b\0",g.inherits(d,h),d.prototype.processChunk=function(a){this.meta=a.meta,null===this._pako&&this._createPako(),this._pako.push(g.transformTo(i,a.data),!1)},d.prototype.flush=function(){h.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},d.prototype.cleanUp=function(){h.prototype.cleanUp.call(this),this._pako=null},d.prototype._createPako=function(){this._pako=new f[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var a=this;this._pako.onData=function(b){a.push({data:b,meta:a.meta})}},c.compressWorker=function(a){return new d("Deflate",a)},c.uncompressWorker=function(){return new d("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:59}],8:[function(a,b,c){"use strict";function d(a,b,c,d){f.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=b,this.zipPlatform=c,this.encodeFileName=d,this.streamFiles=a,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}var e=a("../utils"),f=a("../stream/GenericWorker"),g=a("../utf8"),h=a("../crc32"),i=a("../signature"),j=function(a,b){var c,d="";for(c=0;c<b;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},k=function(a,b){var c=a;return a||(c=b?16893:33204),(65535&c)<<16},l=function(a,b){return 63&(a||0)},m=function(a,b,c,d,f,m){var n,o,p=a.file,q=a.compression,r=m!==g.utf8encode,s=e.transformTo("string",m(p.name)),t=e.transformTo("string",g.utf8encode(p.name)),u=p.comment,v=e.transformTo("string",m(u)),w=e.transformTo("string",g.utf8encode(u)),x=t.length!==p.name.length,y=w.length!==u.length,z="",A="",B="",C=p.dir,D=p.date,E={crc32:0,compressedSize:0,uncompressedSize:0};b&&!c||(E.crc32=a.crc32,E.compressedSize=a.compressedSize,E.uncompressedSize=a.uncompressedSize);var F=0;b&&(F|=8),r||!x&&!y||(F|=2048);var G=0,H=0;C&&(G|=16),"UNIX"===f?(H=798,G|=k(p.unixPermissions,C)):(H=20,G|=l(p.dosPermissions,C)),n=D.getUTCHours(),n<<=6,n|=D.getUTCMinutes(),n<<=5,n|=D.getUTCSeconds()/2,o=D.getUTCFullYear()-1980,o<<=4,o|=D.getUTCMonth()+1,o<<=5,o|=D.getUTCDate(),x&&(A=j(1,1)+j(h(s),4)+t,z+="up"+j(A.length,2)+A),y&&(B=j(1,1)+j(h(v),4)+w,z+="uc"+j(B.length,2)+B);var I="";I+="\n\0",I+=j(F,2),I+=q.magic,I+=j(n,2),I+=j(o,2),I+=j(E.crc32,4),I+=j(E.compressedSize,4),I+=j(E.uncompressedSize,4),I+=j(s.length,2),I+=j(z.length,2);var J=i.LOCAL_FILE_HEADER+I+s+z,K=i.CENTRAL_FILE_HEADER+j(H,2)+I+j(v.length,2)+"\0\0\0\0"+j(G,4)+j(d,4)+s+z+v;return{fileRecord:J,dirRecord:K}},n=function(a,b,c,d,f){var g="",h=e.transformTo("string",f(d));return g=i.CENTRAL_DIRECTORY_END+"\0\0\0\0"+j(a,2)+j(a,2)+j(b,4)+j(c,4)+j(h.length,2)+h},o=function(a){var b="";return b=i.DATA_DESCRIPTOR+j(a.crc32,4)+j(a.compressedSize,4)+j(a.uncompressedSize,4)};e.inherits(d,f),d.prototype.push=function(a){var b=a.meta.percent||0,c=this.entriesCount,d=this._sources.length;this.accumulate?this.contentBuffer.push(a):(this.bytesWritten+=a.data.length,f.prototype.push.call(this,{data:a.data,meta:{currentFile:this.currentFile,percent:c?(b+100*(c-d-1))/c:100}}))},d.prototype.openedSource=function(a){this.currentSourceOffset=this.bytesWritten,this.currentFile=a.file.name;var b=this.streamFiles&&!a.file.dir;if(b){var c=m(a,b,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:c.fileRecord,meta:{percent:0}})}else this.accumulate=!0},d.prototype.closedSource=function(a){this.accumulate=!1;var b=this.streamFiles&&!a.file.dir,c=m(a,b,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(c.dirRecord),b)this.push({data:o(a),meta:{percent:100}});else for(this.push({data:c.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},d.prototype.flush=function(){for(var a=this.bytesWritten,b=0;b<this.dirRecords.length;b++)this.push({data:this.dirRecords[b],meta:{percent:100}});var c=this.bytesWritten-a,d=n(this.dirRecords.length,c,a,this.zipComment,this.encodeFileName);this.push({data:d,meta:{percent:100}})},d.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},d.prototype.registerPrevious=function(a){this._sources.push(a);var b=this;return a.on("data",function(a){b.processChunk(a)}),a.on("end",function(){b.closedSource(b.previous.streamInfo),b._sources.length?b.prepareNextSource():b.end()}),a.on("error",function(a){b.error(a)}),this},d.prototype.resume=function(){return!!f.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},d.prototype.error=function(a){var b=this._sources;if(!f.prototype.error.call(this,a))return!1;for(var c=0;c<b.length;c++)try{b[c].error(a)}catch(a){}return!0},d.prototype.lock=function(){f.prototype.lock.call(this);for(var a=this._sources,b=0;b<a.length;b++)a[b].lock()},b.exports=d},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(a,b,c){"use strict";var d=a("../compressions"),e=a("./ZipFileWorker"),f=function(a,b){var c=a||b,e=d[c];if(!e)throw new Error(c+" is not a valid compression method !");return e};c.generateWorker=function(a,b,c){var d=new e(b.streamFiles,c,b.platform,b.encodeFileName),g=0;try{a.forEach(function(a,c){g++;var e=f(c.options.compression,b.compression),h=c.options.compressionOptions||b.compressionOptions||{},i=c.dir,j=c.date;c._compressWorker(e,h).withStreamInfo("file",{name:a,dir:i,date:j,comment:c.comment||"",unixPermissions:c.unixPermissions,dosPermissions:c.dosPermissions}).pipe(d)}),d.entriesCount=g}catch(h){d.error(h)}return d}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(a,b,c){"use strict";function d(){if(!(this instanceof d))return new d;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files={},this.comment=null,this.root="",this.clone=function(){var a=new d;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a}}d.prototype=a("./object"),d.prototype.loadAsync=a("./load"),d.support=a("./support"),d.defaults=a("./defaults"),d.version="3.1.5",d.loadAsync=function(a,b){return(new d).loadAsync(a,b)},d.external=a("./external"),b.exports=d},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(a,b,c){"use strict";function d(a){return new f.Promise(function(b,c){var d=a.decompressed.getContentWorker().pipe(new i);d.on("error",function(a){c(a)}).on("end",function(){d.streamInfo.crc32!==a.decompressed.crc32?c(new Error("Corrupted zip : CRC32 mismatch")):b()}).resume()})}var e=a("./utils"),f=a("./external"),g=a("./utf8"),e=a("./utils"),h=a("./zipEntries"),i=a("./stream/Crc32Probe"),j=a("./nodejsUtils");b.exports=function(a,b){var c=this;return b=e.extend(b||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:g.utf8decode}),j.isNode&&j.isStream(a)?f.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):e.prepareContent("the loaded zip file",a,!0,b.optimizedBinaryString,b.base64).then(function(a){var c=new h(b);return c.load(a),c}).then(function(a){var c=[f.Promise.resolve(a)],e=a.files;if(b.checkCRC32)for(var g=0;g<e.length;g++)c.push(d(e[g]));return f.Promise.all(c)}).then(function(a){for(var d=a.shift(),e=d.files,f=0;f<e.length;f++){var g=e[f];c.file(g.fileNameStr,g.decompressed,{binary:!0,optimizedBinaryString:!0,date:g.date,dir:g.dir,comment:g.fileCommentStr.length?g.fileCommentStr:null,unixPermissions:g.unixPermissions,dosPermissions:g.dosPermissions,createFolders:b.createFolders})}return d.zipComment.length&&(c.comment=d.zipComment),c})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(a,b,c){"use strict";function d(a,b){f.call(this,"Nodejs stream input adapter for "+a),this._upstreamEnded=!1,this._bindStream(b)}var e=a("../utils"),f=a("../stream/GenericWorker");e.inherits(d,f),d.prototype._bindStream=function(a){var b=this;this._stream=a,a.pause(),a.on("data",function(a){b.push({data:a,meta:{percent:0}})}).on("error",function(a){b.isPaused?this.generatedError=a:b.error(a)}).on("end",function(){b.isPaused?b._upstreamEnded=!0:b.end()})},d.prototype.pause=function(){return!!f.prototype.pause.call(this)&&(this._stream.pause(),!0)},d.prototype.resume=function(){return!!f.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},b.exports=d},{"../stream/GenericWorker":28,"../utils":32}],13:[function(a,b,c){"use strict";function d(a,b,c){e.call(this,b),this._helper=a;var d=this;a.on("data",function(a,b){d.push(a)||d._helper.pause(),c&&c(b)}).on("error",function(a){d.emit("error",a)}).on("end",function(){d.push(null)})}var e=a("readable-stream").Readable,f=a("../utils");f.inherits(d,e),d.prototype._read=function(){this._helper.resume()},b.exports=d},{"../utils":32,"readable-stream":16}],14:[function(a,b,c){"use strict";b.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(a,b){return new Buffer(a,b)},allocBuffer:function(a){return Buffer.alloc?Buffer.alloc(a):new Buffer(a)},isBuffer:function(a){return Buffer.isBuffer(a)},isStream:function(a){return a&&"function"==typeof a.on&&"function"==typeof a.pause&&"function"==typeof a.resume}}},{}],15:[function(a,b,c){"use strict";function d(a){return"[object RegExp]"===Object.prototype.toString.call(a)}var e=a("./utf8"),f=a("./utils"),g=a("./stream/GenericWorker"),h=a("./stream/StreamHelper"),i=a("./defaults"),j=a("./compressedObject"),k=a("./zipObject"),l=a("./generate"),m=a("./nodejsUtils"),n=a("./nodejs/NodejsStreamInputAdapter"),o=function(a,b,c){var d,e=f.getTypeOf(b),h=f.extend(c||{},i);h.date=h.date||new Date,null!==h.compression&&(h.compression=h.compression.toUpperCase()),"string"==typeof h.unixPermissions&&(h.unixPermissions=parseInt(h.unixPermissions,8)),h.unixPermissions&&16384&h.unixPermissions&&(h.dir=!0),h.dosPermissions&&16&h.dosPermissions&&(h.dir=!0),h.dir&&(a=q(a)),h.createFolders&&(d=p(a))&&r.call(this,d,!0);var l="string"===e&&h.binary===!1&&h.base64===!1;c&&"undefined"!=typeof c.binary||(h.binary=!l);var o=b instanceof j&&0===b.uncompressedSize;(o||h.dir||!b||0===b.length)&&(h.base64=!1,h.binary=!0,b="",h.compression="STORE",e="string");var s=null;s=b instanceof j||b instanceof g?b:m.isNode&&m.isStream(b)?new n(a,b):f.prepareContent(a,b,h.binary,h.optimizedBinaryString,h.base64);var t=new k(a,s,h);this.files[a]=t},p=function(a){"/"===a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},q=function(a){return"/"!==a.slice(-1)&&(a+="/"),a},r=function(a,b){return b="undefined"!=typeof b?b:i.createFolders,a=q(a),this.files[a]||o.call(this,a,null,{dir:!0,createFolders:b}),this.files[a]},s={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(a){var b,c,d;for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],c=b.slice(this.root.length,b.length),c&&b.slice(0,this.root.length)===this.root&&a(c,d))},filter:function(a){var b=[];return this.forEach(function(c,d){a(c,d)&&b.push(d)}),b},file:function(a,b,c){if(1===arguments.length){if(d(a)){var e=a;return this.filter(function(a,b){return!b.dir&&e.test(a)})}var f=this.files[this.root+a];return f&&!f.dir?f:null}return a=this.root+a,o.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(d(a))return this.filter(function(b,c){return c.dir&&a.test(b)});var b=this.root+a,c=r.call(this,b),e=this.clone();return e.root=c.name,e},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!==a.slice(-1)&&(a+="/"),b=this.files[a]),b&&!b.dir)delete this.files[a];else for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];return this},generate:function(a){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(a){var b,c={};try{if(c=f.extend(a||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:e.utf8encode}),c.type=c.type.toLowerCase(),c.compression=c.compression.toUpperCase(),"binarystring"===c.type&&(c.type="string"),!c.type)throw new Error("No output type specified.");f.checkSupport(c.type),"darwin"!==c.platform&&"freebsd"!==c.platform&&"linux"!==c.platform&&"sunos"!==c.platform||(c.platform="UNIX"),"win32"===c.platform&&(c.platform="DOS");var d=c.comment||this.comment||"";b=l.generateWorker(this,c,d)}catch(i){b=new g("error"),b.error(i)}return new h(b,c.type||"string",c.mimeType)},generateAsync:function(a,b){return this.generateInternalStream(a).accumulate(b)},generateNodeStream:function(a,b){return a=a||{},a.type||(a.type="nodebuffer"),this.generateInternalStream(a).toNodejsStream(b)}};b.exports=s},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(a,b,c){b.exports=a("stream")},{stream:void 0}],17:[function(a,b,c){"use strict";function d(a){e.call(this,a);for(var b=0;b<this.data.length;b++)a[b]=255&a[b]}var e=a("./DataReader"),f=a("../utils");f.inherits(d,e),d.prototype.byteAt=function(a){return this.data[this.zero+a]},d.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f-this.zero;return-1},d.prototype.readAndCheckSignature=function(a){var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.readData(4);return b===f[0]&&c===f[1]&&d===f[2]&&e===f[3]},d.prototype.readData=function(a){if(this.checkOffset(a),0===a)return[];var b=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,b},b.exports=d},{"../utils":32,"./DataReader":18}],18:[function(a,b,c){"use strict";function d(a){this.data=a,this.length=a.length,this.index=0,this.zero=0}var e=a("../utils");d.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<this.zero+a||a<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(a){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return e.transformTo("string",this.readData(a))},readData:function(a){},lastIndexOfSignature:function(a){},readAndCheckSignature:function(a){},readDate:function(){var a=this.readInt(4);return new Date(Date.UTC((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1))}},b.exports=d},{"../utils":32}],19:[function(a,b,c){"use strict";function d(a){e.call(this,a)}var e=a("./Uint8ArrayReader"),f=a("../utils");f.inherits(d,e),d.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,b},b.exports=d},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(a,b,c){"use strict";function d(a){e.call(this,a)}var e=a("./DataReader"),f=a("../utils");f.inherits(d,e),d.prototype.byteAt=function(a){return this.data.charCodeAt(this.zero+a)},d.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)-this.zero},d.prototype.readAndCheckSignature=function(a){var b=this.readData(4);return a===b},d.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,b},b.exports=d},{"../utils":32,"./DataReader":18}],21:[function(a,b,c){"use strict";function d(a){e.call(this,a)}var e=a("./ArrayReader"),f=a("../utils");f.inherits(d,e),d.prototype.readData=function(a){if(this.checkOffset(a),0===a)return new Uint8Array(0);var b=this.data.subarray(this.zero+this.index,this.zero+this.index+a);return this.index+=a,b},b.exports=d},{"../utils":32,"./ArrayReader":17}],22:[function(a,b,c){"use strict";var d=a("../utils"),e=a("../support"),f=a("./ArrayReader"),g=a("./StringReader"),h=a("./NodeBufferReader"),i=a("./Uint8ArrayReader");b.exports=function(a){var b=d.getTypeOf(a);return d.checkSupport(b),"string"!==b||e.uint8array?"nodebuffer"===b?new h(a):e.uint8array?new i(d.transformTo("uint8array",a)):new f(d.transformTo("array",a)):new g(a)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],24:[function(a,b,c){"use strict";function d(a){e.call(this,"ConvertWorker to "+a),this.destType=a}var e=a("./GenericWorker"),f=a("../utils");f.inherits(d,e),d.prototype.processChunk=function(a){this.push({data:f.transformTo(this.destType,a.data),meta:a.meta})},b.exports=d},{"../utils":32,"./GenericWorker":28}],25:[function(a,b,c){"use strict";function d(){e.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}var e=a("./GenericWorker"),f=a("../crc32"),g=a("../utils");g.inherits(d,e),d.prototype.processChunk=function(a){this.streamInfo.crc32=f(a.data,this.streamInfo.crc32||0),this.push(a)},b.exports=d},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(a,b,c){"use strict";function d(a){f.call(this,"DataLengthProbe for "+a),this.propName=a,this.withStreamInfo(a,0)}var e=a("../utils"),f=a("./GenericWorker");e.inherits(d,f),d.prototype.processChunk=function(a){if(a){var b=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=b+a.data.length}f.prototype.processChunk.call(this,a)},b.exports=d},{"../utils":32,"./GenericWorker":28}],27:[function(a,b,c){"use strict";function d(a){f.call(this,"DataWorker");var b=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,a.then(function(a){b.dataIsReady=!0,b.data=a,b.max=a&&a.length||0,b.type=e.getTypeOf(a),b.isPaused||b._tickAndRepeat()},function(a){b.error(a)})}var e=a("../utils"),f=a("./GenericWorker"),g=16384;e.inherits(d,f),d.prototype.cleanUp=function(){f.prototype.cleanUp.call(this),this.data=null},d.prototype.resume=function(){return!!f.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,e.delay(this._tickAndRepeat,[],this)),!0)},d.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(e.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},d.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var a=g,b=null,c=Math.min(this.max,this.index+a);if(this.index>=this.max)return this.end();switch(this.type){case"string":b=this.data.substring(this.index,c);break;case"uint8array":b=this.data.subarray(this.index,c);break;case"array":case"nodebuffer":b=this.data.slice(this.index,c)}return this.index=c,this.push({data:b,meta:{percent:this.max?this.index/this.max*100:0}})},b.exports=d},{"../utils":32,"./GenericWorker":28}],28:[function(a,b,c){"use strict";function d(a){this.name=a||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}d.prototype={push:function(a){this.emit("data",a)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(a){this.emit("error",a)}return!0},error:function(a){return!this.isFinished&&(this.isPaused?this.generatedError=a:(this.isFinished=!0,this.emit("error",a),this.previous&&this.previous.error(a),this.cleanUp()),!0)},on:function(a,b){return this._listeners[a].push(b),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(a,b){if(this._listeners[a])for(var c=0;c<this._listeners[a].length;c++)this._listeners[a][c].call(this,b)},pipe:function(a){return a.registerPrevious(this)},registerPrevious:function(a){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=a.streamInfo,this.mergeStreamInfo(),this.previous=a;var b=this;return a.on("data",function(a){b.processChunk(a)}),a.on("end",function(){b.end()}),a.on("error",function(a){b.error(a)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;this.isPaused=!1;var a=!1;return this.generatedError&&(this.error(this.generatedError),a=!0),this.previous&&this.previous.resume(),!a},flush:function(){},processChunk:function(a){this.push(a)},withStreamInfo:function(a,b){return this.extraStreamInfo[a]=b,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var a in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(a)&&(this.streamInfo[a]=this.extraStreamInfo[a])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var a="Worker "+this.name;return this.previous?this.previous+" -> "+a:a}},b.exports=d},{}],29:[function(a,b,c){"use strict";function d(a,b,c){switch(a){case"blob":return h.newBlob(h.transformTo("arraybuffer",b),c);case"base64":return k.encode(b);default:return h.transformTo(a,b)}}function e(a,b){var c,d=0,e=null,f=0;for(c=0;c<b.length;c++)f+=b[c].length;switch(a){case"string":return b.join("");case"array":return Array.prototype.concat.apply([],b);case"uint8array":for(e=new Uint8Array(f),c=0;c<b.length;c++)e.set(b[c],d),d+=b[c].length;return e;case"nodebuffer":return Buffer.concat(b);default:throw new Error("concat : unsupported type '"+a+"'")}}function f(a,b){return new m.Promise(function(c,f){var g=[],h=a._internalType,i=a._outputType,j=a._mimeType;a.on("data",function(a,c){g.push(a),b&&b(c)}).on("error",function(a){g=[],f(a)}).on("end",function(){try{var a=d(i,e(h,g),j);c(a)}catch(b){f(b)}g=[]}).resume()})}function g(a,b,c){var d=b;switch(b){case"blob":case"arraybuffer":d="uint8array";break;case"base64":d="string"}try{this._internalType=d,this._outputType=b,this._mimeType=c,h.checkSupport(d),this._worker=a.pipe(new i(d)),a.lock()}catch(e){this._worker=new j("error"),this._worker.error(e)}}var h=a("../utils"),i=a("./ConvertWorker"),j=a("./GenericWorker"),k=a("../base64"),l=a("../support"),m=a("../external"),n=null;if(l.nodestream)try{n=a("../nodejs/NodejsStreamOutputAdapter")}catch(o){}g.prototype={accumulate:function(a){return f(this,a)},on:function(a,b){var c=this;return"data"===a?this._worker.on(a,function(a){b.call(c,a.data,a.meta)}):this._worker.on(a,function(){h.delay(b,arguments,c)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(a){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new n(this,{objectMode:"nodebuffer"!==this._outputType},a)}},b.exports=g},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(a,b,c){"use strict";if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer="undefined"!=typeof Buffer,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var d=new ArrayBuffer(0);try{c.blob=0===new Blob([d],{type:"application/zip"}).size}catch(e){try{var f=self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder,g=new f;g.append(d),c.blob=0===g.getBlob("application/zip").size}catch(e){c.blob=!1}}}try{c.nodestream=!!a("readable-stream").Readable}catch(e){c.nodestream=!1}},{"readable-stream":16}],31:[function(a,b,c){"use strict";function d(){i.call(this,"utf-8 decode"),this.leftOver=null}function e(){i.call(this,"utf-8 encode")}for(var f=a("./utils"),g=a("./support"),h=a("./nodejsUtils"),i=a("./stream/GenericWorker"),j=new Array(256),k=0;k<256;k++)j[k]=k>=252?6:k>=248?5:k>=240?4:k>=224?3:k>=192?2:1;j[254]=j[254]=1;var l=function(a){var b,c,d,e,f,h=a.length,i=0;for(e=0;e<h;e++)c=a.charCodeAt(e),55296===(64512&c)&&e+1<h&&(d=a.charCodeAt(e+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),e++)),i+=c<128?1:c<2048?2:c<65536?3:4;for(b=g.uint8array?new Uint8Array(i):new Array(i),f=0,e=0;f<i;e++)c=a.charCodeAt(e),55296===(64512&c)&&e+1<h&&(d=a.charCodeAt(e+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),e++)),c<128?b[f++]=c:c<2048?(b[f++]=192|c>>>6,b[f++]=128|63&c):c<65536?(b[f++]=224|c>>>12,b[f++]=128|c>>>6&63,b[f++]=128|63&c):(b[f++]=240|c>>>18,b[f++]=128|c>>>12&63,b[f++]=128|c>>>6&63,b[f++]=128|63&c);return b},m=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return c<0?b:0===c?b:c+j[a[c]]>b?c:b},n=function(a){var b,c,d,e,g=a.length,h=new Array(2*g);for(c=0,b=0;b<g;)if(d=a[b++],d<128)h[c++]=d;else if(e=j[d],e>4)h[c++]=65533,b+=e-1;else{for(d&=2===e?31:3===e?15:7;e>1&&b<g;)d=d<<6|63&a[b++],e--;e>1?h[c++]=65533:d<65536?h[c++]=d:(d-=65536,h[c++]=55296|d>>10&1023,h[c++]=56320|1023&d)}return h.length!==c&&(h.subarray?h=h.subarray(0,c):h.length=c),f.applyFromCharCode(h)};c.utf8encode=function(a){return g.nodebuffer?h.newBufferFrom(a,"utf-8"):l(a)},c.utf8decode=function(a){return g.nodebuffer?f.transformTo("nodebuffer",a).toString("utf-8"):(a=f.transformTo(g.uint8array?"uint8array":"array",a),n(a))},f.inherits(d,i),d.prototype.processChunk=function(a){var b=f.transformTo(g.uint8array?"uint8array":"array",a.data);if(this.leftOver&&this.leftOver.length){if(g.uint8array){var d=b;b=new Uint8Array(d.length+this.leftOver.length),b.set(this.leftOver,0),b.set(d,this.leftOver.length)}else b=this.leftOver.concat(b);this.leftOver=null}var e=m(b),h=b;e!==b.length&&(g.uint8array?(h=b.subarray(0,e),this.leftOver=b.subarray(e,b.length)):(h=b.slice(0,e),this.leftOver=b.slice(e,b.length))),this.push({data:c.utf8decode(h),meta:a.meta})},d.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:c.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},c.Utf8DecodeWorker=d,f.inherits(e,i),e.prototype.processChunk=function(a){this.push({data:c.utf8encode(a.data),meta:a.meta})},c.Utf8EncodeWorker=e},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(a,b,c){"use strict";function d(a){var b=null;return b=i.uint8array?new Uint8Array(a.length):new Array(a.length),f(a,b)}function e(a){return a}function f(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function g(a){var b=65536,d=c.getTypeOf(a),e=!0;if("uint8array"===d?e=n.applyCanBeUsed.uint8array:"nodebuffer"===d&&(e=n.applyCanBeUsed.nodebuffer),e)for(;b>1;)try{return n.stringifyByChunk(a,d,b)}catch(f){b=Math.floor(b/2)}return n.stringifyByChar(a)}function h(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];
return b}var i=a("./support"),j=a("./base64"),k=a("./nodejsUtils"),l=a("core-js/library/fn/set-immediate"),m=a("./external");c.newBlob=function(a,b){c.checkSupport("blob");try{return new Blob([a],{type:b})}catch(d){try{var e=self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder,f=new e;return f.append(a),f.getBlob(b)}catch(d){throw new Error("Bug : can't construct the Blob.")}}};var n={stringifyByChunk:function(a,b,c){var d=[],e=0,f=a.length;if(f<=c)return String.fromCharCode.apply(null,a);for(;e<f;)"array"===b||"nodebuffer"===b?d.push(String.fromCharCode.apply(null,a.slice(e,Math.min(e+c,f)))):d.push(String.fromCharCode.apply(null,a.subarray(e,Math.min(e+c,f)))),e+=c;return d.join("")},stringifyByChar:function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(a[c]);return b},applyCanBeUsed:{uint8array:function(){try{return i.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(a){return!1}}(),nodebuffer:function(){try{return i.nodebuffer&&1===String.fromCharCode.apply(null,k.allocBuffer(1)).length}catch(a){return!1}}()}};c.applyFromCharCode=g;var o={};o.string={string:e,array:function(a){return f(a,new Array(a.length))},arraybuffer:function(a){return o.string.uint8array(a).buffer},uint8array:function(a){return f(a,new Uint8Array(a.length))},nodebuffer:function(a){return f(a,k.allocBuffer(a.length))}},o.array={string:g,array:e,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return k.newBufferFrom(a)}},o.arraybuffer={string:function(a){return g(new Uint8Array(a))},array:function(a){return h(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:e,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return k.newBufferFrom(new Uint8Array(a))}},o.uint8array={string:g,array:function(a){return h(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:e,nodebuffer:function(a){return k.newBufferFrom(a)}},o.nodebuffer={string:g,array:function(a){return h(a,new Array(a.length))},arraybuffer:function(a){return o.nodebuffer.uint8array(a).buffer},uint8array:function(a){return h(a,new Uint8Array(a.length))},nodebuffer:e},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=o[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":i.nodebuffer&&k.isBuffer(a)?"nodebuffer":i.uint8array&&a instanceof Uint8Array?"uint8array":i.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=i[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this platform")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(b<16?"0":"")+b.toString(16).toUpperCase();return d},c.delay=function(a,b,c){l(function(){a.apply(c||null,b||[])})},c.inherits=function(a,b){var c=function(){};c.prototype=b.prototype,a.prototype=new c},c.extend=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},c.prepareContent=function(a,b,e,f,g){var h=m.Promise.resolve(b).then(function(a){var b=i.blob&&(a instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(a))!==-1);return b&&"undefined"!=typeof FileReader?new m.Promise(function(b,c){var d=new FileReader;d.onload=function(a){b(a.target.result)},d.onerror=function(a){c(a.target.error)},d.readAsArrayBuffer(a)}):a});return h.then(function(b){var h=c.getTypeOf(b);return h?("arraybuffer"===h?b=c.transformTo("uint8array",b):"string"===h&&(g?b=j.decode(b):e&&f!==!0&&(b=d(b))),b):m.Promise.reject(new Error("Can't read the data of '"+a+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"core-js/library/fn/set-immediate":36}],33:[function(a,b,c){"use strict";function d(a){this.files=[],this.loadOptions=a}var e=a("./reader/readerFor"),f=a("./utils"),g=a("./signature"),h=a("./zipEntry"),i=(a("./utf8"),a("./support"));d.prototype={checkSignature:function(a){if(!this.reader.readAndCheckSignature(a)){this.reader.index-=4;var b=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+f.pretty(b)+", expected "+f.pretty(a)+")")}},isSignature:function(a,b){var c=this.reader.index;this.reader.setIndex(a);var d=this.reader.readString(4),e=d===b;return this.reader.setIndex(c),e},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var a=this.reader.readData(this.zipCommentLength),b=i.uint8array?"uint8array":"array",c=f.transformTo(b,a);this.zipComment=this.loadOptions.decodeFileName(c)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;e<d;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readData(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(g.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8(),b.processAttributes()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(g.CENTRAL_FILE_HEADER);)a=new h({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(g.CENTRAL_DIRECTORY_END);if(a<0){var b=!this.isSignature(0,g.LOCAL_FILE_HEADER);throw b?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory")}this.reader.setIndex(a);var c=a;if(this.checkSignature(g.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===f.MAX_VALUE_16BITS||this.diskWithCentralDirStart===f.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===f.MAX_VALUE_16BITS||this.centralDirRecords===f.MAX_VALUE_16BITS||this.centralDirSize===f.MAX_VALUE_32BITS||this.centralDirOffset===f.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(g.ZIP64_CENTRAL_DIRECTORY_LOCATOR),a<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(a),this.checkSignature(g.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,g.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(g.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(g.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var d=this.centralDirOffset+this.centralDirSize;this.zip64&&(d+=20,d+=12+this.zip64EndOfCentralSize);var e=c-d;if(e>0)this.isSignature(c,g.CENTRAL_FILE_HEADER)||(this.reader.zero=e);else if(e<0)throw new Error("Corrupted zip: missing "+Math.abs(e)+" bytes.")},prepareReader:function(a){this.reader=e(a)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=d},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utf8":31,"./utils":32,"./zipEntry":34}],34:[function(a,b,c){"use strict";function d(a,b){this.options=a,this.loadOptions=b}var e=a("./reader/readerFor"),f=a("./utils"),g=a("./compressedObject"),h=a("./crc32"),i=a("./utf8"),j=a("./compressions"),k=a("./support"),l=0,m=3,n=function(a){for(var b in j)if(j.hasOwnProperty(b)&&j[b].magic===a)return j[b];return null};d.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readData(this.fileNameLength),a.skip(c),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(b=n(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+f.pretty(this.compressionMethod)+" unknown (inner file : "+f.transformTo("string",this.fileName)+")");this.decompressed=new g(this.compressedSize,this.uncompressedSize,this.crc32,b,a.readData(this.compressedSize))},readCentralPart:function(a){this.versionMadeBy=a.readInt(2),a.skip(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4);var b=a.readInt(2);if(this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");a.skip(b),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var a=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),a===l&&(this.dosPermissions=63&this.externalFileAttributes),a===m&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(a){if(this.extraFields[1]){var b=e(this.extraFields[1].value);this.uncompressedSize===f.MAX_VALUE_32BITS&&(this.uncompressedSize=b.readInt(8)),this.compressedSize===f.MAX_VALUE_32BITS&&(this.compressedSize=b.readInt(8)),this.localHeaderOffset===f.MAX_VALUE_32BITS&&(this.localHeaderOffset=b.readInt(8)),this.diskNumberStart===f.MAX_VALUE_32BITS&&(this.diskNumberStart=b.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});a.index<e;)b=a.readInt(2),c=a.readInt(2),d=a.readData(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){var a=k.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=i.utf8decode(this.fileName),this.fileCommentStr=i.utf8decode(this.fileComment);else{var b=this.findExtraFieldUnicodePath();if(null!==b)this.fileNameStr=b;else{var c=f.transformTo(a,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(c)}var d=this.findExtraFieldUnicodeComment();if(null!==d)this.fileCommentStr=d;else{var e=f.transformTo(a,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(e)}}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=e(a.value);return 1!==b.readInt(1)?null:h(this.fileName)!==b.readInt(4)?null:i.utf8decode(b.readData(a.length-5))}return null},findExtraFieldUnicodeComment:function(){var a=this.extraFields[25461];if(a){var b=e(a.value);return 1!==b.readInt(1)?null:h(this.fileComment)!==b.readInt(4)?null:i.utf8decode(b.readData(a.length-5))}return null}},b.exports=d},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(a,b,c){"use strict";var d=a("./stream/StreamHelper"),e=a("./stream/DataWorker"),f=a("./utf8"),g=a("./compressedObject"),h=a("./stream/GenericWorker"),i=function(a,b,c){this.name=a,this.dir=c.dir,this.date=c.date,this.comment=c.comment,this.unixPermissions=c.unixPermissions,this.dosPermissions=c.dosPermissions,this._data=b,this._dataBinary=c.binary,this.options={compression:c.compression,compressionOptions:c.compressionOptions}};i.prototype={internalStream:function(a){var b=null,c="string";try{if(!a)throw new Error("No output type specified.");c=a.toLowerCase();var e="string"===c||"text"===c;"binarystring"!==c&&"text"!==c||(c="string"),b=this._decompressWorker();var g=!this._dataBinary;g&&!e&&(b=b.pipe(new f.Utf8EncodeWorker)),!g&&e&&(b=b.pipe(new f.Utf8DecodeWorker))}catch(i){b=new h("error"),b.error(i)}return new d(b,c,"")},async:function(a,b){return this.internalStream(a).accumulate(b)},nodeStream:function(a,b){return this.internalStream(a||"nodebuffer").toNodejsStream(b)},_compressWorker:function(a,b){if(this._data instanceof g&&this._data.compression.magic===a.magic)return this._data.getCompressedWorker();var c=this._decompressWorker();return this._dataBinary||(c=c.pipe(new f.Utf8EncodeWorker)),g.createWorkerFrom(c,a,b)},_decompressWorker:function(){return this._data instanceof g?this._data.getContentWorker():this._data instanceof h?this._data:new e(this._data)}};for(var j=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],k=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},l=0;l<j.length;l++)i.prototype[j[l]]=k;b.exports=i},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(a,b,c){a("../modules/web.immediate"),b.exports=a("../modules/_core").setImmediate},{"../modules/_core":40,"../modules/web.immediate":56}],37:[function(a,b,c){b.exports=function(a){if("function"!=typeof a)throw TypeError(a+" is not a function!");return a}},{}],38:[function(a,b,c){var d=a("./_is-object");b.exports=function(a){if(!d(a))throw TypeError(a+" is not an object!");return a}},{"./_is-object":51}],39:[function(a,b,c){var d={}.toString;b.exports=function(a){return d.call(a).slice(8,-1)}},{}],40:[function(a,b,c){var d=b.exports={version:"2.3.0"};"number"==typeof __e&&(__e=d)},{}],41:[function(a,b,c){var d=a("./_a-function");b.exports=function(a,b,c){if(d(a),void 0===b)return a;switch(c){case 1:return function(c){return a.call(b,c)};case 2:return function(c,d){return a.call(b,c,d)};case 3:return function(c,d,e){return a.call(b,c,d,e)}}return function(){return a.apply(b,arguments)}}},{"./_a-function":37}],42:[function(a,b,c){b.exports=!a("./_fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./_fails":45}],43:[function(a,b,c){var d=a("./_is-object"),e=a("./_global").document,f=d(e)&&d(e.createElement);b.exports=function(a){return f?e.createElement(a):{}}},{"./_global":46,"./_is-object":51}],44:[function(a,b,c){var d=a("./_global"),e=a("./_core"),f=a("./_ctx"),g=a("./_hide"),h="prototype",i=function(a,b,c){var j,k,l,m=a&i.F,n=a&i.G,o=a&i.S,p=a&i.P,q=a&i.B,r=a&i.W,s=n?e:e[b]||(e[b]={}),t=s[h],u=n?d:o?d[b]:(d[b]||{})[h];n&&(c=b);for(j in c)k=!m&&u&&void 0!==u[j],k&&j in s||(l=k?u[j]:c[j],s[j]=n&&"function"!=typeof u[j]?c[j]:q&&k?f(l,d):r&&u[j]==l?function(a){var b=function(b,c,d){if(this instanceof a){switch(arguments.length){case 0:return new a;case 1:return new a(b);case 2:return new a(b,c)}return new a(b,c,d)}return a.apply(this,arguments)};return b[h]=a[h],b}(l):p&&"function"==typeof l?f(Function.call,l):l,p&&((s.virtual||(s.virtual={}))[j]=l,a&i.R&&t&&!t[j]&&g(t,j,l)))};i.F=1,i.G=2,i.S=4,i.P=8,i.B=16,i.W=32,i.U=64,i.R=128,b.exports=i},{"./_core":40,"./_ctx":41,"./_global":46,"./_hide":47}],45:[function(a,b,c){b.exports=function(a){try{return!!a()}catch(b){return!0}}},{}],46:[function(a,b,c){var d=b.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=d)},{}],47:[function(a,b,c){var d=a("./_object-dp"),e=a("./_property-desc");b.exports=a("./_descriptors")?function(a,b,c){return d.f(a,b,e(1,c))}:function(a,b,c){return a[b]=c,a}},{"./_descriptors":42,"./_object-dp":52,"./_property-desc":53}],48:[function(a,b,c){b.exports=a("./_global").document&&document.documentElement},{"./_global":46}],49:[function(a,b,c){b.exports=!a("./_descriptors")&&!a("./_fails")(function(){return 7!=Object.defineProperty(a("./_dom-create")("div"),"a",{get:function(){return 7}}).a})},{"./_descriptors":42,"./_dom-create":43,"./_fails":45}],50:[function(a,b,c){b.exports=function(a,b,c){var d=void 0===c;switch(b.length){case 0:return d?a():a.call(c);case 1:return d?a(b[0]):a.call(c,b[0]);case 2:return d?a(b[0],b[1]):a.call(c,b[0],b[1]);case 3:return d?a(b[0],b[1],b[2]):a.call(c,b[0],b[1],b[2]);case 4:return d?a(b[0],b[1],b[2],b[3]):a.call(c,b[0],b[1],b[2],b[3])}return a.apply(c,b)}},{}],51:[function(a,b,c){b.exports=function(a){return"object"==typeof a?null!==a:"function"==typeof a}},{}],52:[function(a,b,c){var d=a("./_an-object"),e=a("./_ie8-dom-define"),f=a("./_to-primitive"),g=Object.defineProperty;c.f=a("./_descriptors")?Object.defineProperty:function(a,b,c){if(d(a),b=f(b,!0),d(c),e)try{return g(a,b,c)}catch(h){}if("get"in c||"set"in c)throw TypeError("Accessors not supported!");return"value"in c&&(a[b]=c.value),a}},{"./_an-object":38,"./_descriptors":42,"./_ie8-dom-define":49,"./_to-primitive":55}],53:[function(a,b,c){b.exports=function(a,b){return{enumerable:!(1&a),configurable:!(2&a),writable:!(4&a),value:b}}},{}],54:[function(a,b,c){var d,e,f,g=a("./_ctx"),h=a("./_invoke"),i=a("./_html"),j=a("./_dom-create"),k=a("./_global"),l=k.process,m=k.setImmediate,n=k.clearImmediate,o=k.MessageChannel,p=0,q={},r="onreadystatechange",s=function(){var a=+this;if(q.hasOwnProperty(a)){var b=q[a];delete q[a],b()}},t=function(a){s.call(a.data)};m&&n||(m=function(a){for(var b=[],c=1;arguments.length>c;)b.push(arguments[c++]);return q[++p]=function(){h("function"==typeof a?a:Function(a),b)},d(p),p},n=function(a){delete q[a]},"process"==a("./_cof")(l)?d=function(a){l.nextTick(g(s,a,1))}:o?(e=new o,f=e.port2,e.port1.onmessage=t,d=g(f.postMessage,f,1)):k.addEventListener&&"function"==typeof postMessage&&!k.importScripts?(d=function(a){k.postMessage(a+"","*")},k.addEventListener("message",t,!1)):d=r in j("script")?function(a){i.appendChild(j("script"))[r]=function(){i.removeChild(this),s.call(a)}}:function(a){setTimeout(g(s,a,1),0)}),b.exports={set:m,clear:n}},{"./_cof":39,"./_ctx":41,"./_dom-create":43,"./_global":46,"./_html":48,"./_invoke":50}],55:[function(a,b,c){var d=a("./_is-object");b.exports=function(a,b){if(!d(a))return a;var c,e;if(b&&"function"==typeof(c=a.toString)&&!d(e=c.call(a)))return e;if("function"==typeof(c=a.valueOf)&&!d(e=c.call(a)))return e;if(!b&&"function"==typeof(c=a.toString)&&!d(e=c.call(a)))return e;throw TypeError("Can't convert object to primitive value")}},{"./_is-object":51}],56:[function(a,b,c){var d=a("./_export"),e=a("./_task");d(d.G+d.B,{setImmediate:e.set,clearImmediate:e.clear})},{"./_export":44,"./_task":54}],57:[function(a,b,c){(function(a){"use strict";function c(){k=!0;for(var a,b,c=l.length;c;){for(b=l,l=[],a=-1;++a<c;)b[a]();c=l.length}k=!1}function d(a){1!==l.push(a)||k||e()}var e,f=a.MutationObserver||a.WebKitMutationObserver;if(f){var g=0,h=new f(c),i=a.document.createTextNode("");h.observe(i,{characterData:!0}),e=function(){i.data=g=++g%2}}else if(a.setImmediate||"undefined"==typeof a.MessageChannel)e="document"in a&&"onreadystatechange"in a.document.createElement("script")?function(){var b=a.document.createElement("script");b.onreadystatechange=function(){c(),b.onreadystatechange=null,b.parentNode.removeChild(b),b=null},a.document.documentElement.appendChild(b)}:function(){setTimeout(c,0)};else{var j=new a.MessageChannel;j.port1.onmessage=c,e=function(){j.port2.postMessage(0)}}var k,l=[];b.exports=d}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],58:[function(a,b,c){"use strict";function d(){}function e(a){if("function"!=typeof a)throw new TypeError("resolver must be a function");this.state=s,this.queue=[],this.outcome=void 0,a!==d&&i(this,a)}function f(a,b,c){this.promise=a,"function"==typeof b&&(this.onFulfilled=b,this.callFulfilled=this.otherCallFulfilled),"function"==typeof c&&(this.onRejected=c,this.callRejected=this.otherCallRejected)}function g(a,b,c){o(function(){var d;try{d=b(c)}catch(e){return p.reject(a,e)}d===a?p.reject(a,new TypeError("Cannot resolve promise with itself")):p.resolve(a,d)})}function h(a){var b=a&&a.then;if(a&&("object"==typeof a||"function"==typeof a)&&"function"==typeof b)return function(){b.apply(a,arguments)}}function i(a,b){function c(b){f||(f=!0,p.reject(a,b))}function d(b){f||(f=!0,p.resolve(a,b))}function e(){b(d,c)}var f=!1,g=j(e);"error"===g.status&&c(g.value)}function j(a,b){var c={};try{c.value=a(b),c.status="success"}catch(d){c.status="error",c.value=d}return c}function k(a){return a instanceof this?a:p.resolve(new this(d),a)}function l(a){var b=new this(d);return p.reject(b,a)}function m(a){function b(a,b){function d(a){g[b]=a,++h!==e||f||(f=!0,p.resolve(j,g))}c.resolve(a).then(d,function(a){f||(f=!0,p.reject(j,a))})}var c=this;if("[object Array]"!==Object.prototype.toString.call(a))return this.reject(new TypeError("must be an array"));var e=a.length,f=!1;if(!e)return this.resolve([]);for(var g=new Array(e),h=0,i=-1,j=new this(d);++i<e;)b(a[i],i);return j}function n(a){function b(a){c.resolve(a).then(function(a){f||(f=!0,p.resolve(h,a))},function(a){f||(f=!0,p.reject(h,a))})}var c=this;if("[object Array]"!==Object.prototype.toString.call(a))return this.reject(new TypeError("must be an array"));var e=a.length,f=!1;if(!e)return this.resolve([]);for(var g=-1,h=new this(d);++g<e;)b(a[g]);return h}var o=a("immediate"),p={},q=["REJECTED"],r=["FULFILLED"],s=["PENDING"];b.exports=e,e.prototype["catch"]=function(a){return this.then(null,a)},e.prototype.then=function(a,b){if("function"!=typeof a&&this.state===r||"function"!=typeof b&&this.state===q)return this;var c=new this.constructor(d);if(this.state!==s){var e=this.state===r?a:b;g(c,e,this.outcome)}else this.queue.push(new f(c,a,b));return c},f.prototype.callFulfilled=function(a){p.resolve(this.promise,a)},f.prototype.otherCallFulfilled=function(a){g(this.promise,this.onFulfilled,a)},f.prototype.callRejected=function(a){p.reject(this.promise,a)},f.prototype.otherCallRejected=function(a){g(this.promise,this.onRejected,a)},p.resolve=function(a,b){var c=j(h,b);if("error"===c.status)return p.reject(a,c.value);var d=c.value;if(d)i(a,d);else{a.state=r,a.outcome=b;for(var e=-1,f=a.queue.length;++e<f;)a.queue[e].callFulfilled(b)}return a},p.reject=function(a,b){a.state=q,a.outcome=b;for(var c=-1,d=a.queue.length;++c<d;)a.queue[c].callRejected(b);return a},e.resolve=k,e.reject=l,e.all=m,e.race=n},{immediate:57}],59:[function(a,b,c){"use strict";var d=a("./lib/utils/common").assign,e=a("./lib/deflate"),f=a("./lib/inflate"),g=a("./lib/zlib/constants"),h={};d(h,e,f,g),b.exports=h},{"./lib/deflate":60,"./lib/inflate":61,"./lib/utils/common":62,"./lib/zlib/constants":65}],60:[function(a,b,c){"use strict";function d(a){if(!(this instanceof d))return new d(a);this.options=i.assign({level:s,method:u,chunkSize:16384,windowBits:15,memLevel:8,strategy:t,to:""},a||{});var b=this.options;b.raw&&b.windowBits>0?b.windowBits=-b.windowBits:b.gzip&&b.windowBits>0&&b.windowBits<16&&(b.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new l,this.strm.avail_out=0;var c=h.deflateInit2(this.strm,b.level,b.method,b.windowBits,b.memLevel,b.strategy);if(c!==p)throw new Error(k[c]);if(b.header&&h.deflateSetHeader(this.strm,b.header),b.dictionary){var e;if(e="string"==typeof b.dictionary?j.string2buf(b.dictionary):"[object ArrayBuffer]"===m.call(b.dictionary)?new Uint8Array(b.dictionary):b.dictionary,c=h.deflateSetDictionary(this.strm,e),c!==p)throw new Error(k[c]);this._dict_set=!0}}function e(a,b){var c=new d(b);if(c.push(a,!0),c.err)throw c.msg||k[c.err];return c.result}function f(a,b){return b=b||{},b.raw=!0,e(a,b)}function g(a,b){return b=b||{},b.gzip=!0,e(a,b)}var h=a("./zlib/deflate"),i=a("./utils/common"),j=a("./utils/strings"),k=a("./zlib/messages"),l=a("./zlib/zstream"),m=Object.prototype.toString,n=0,o=4,p=0,q=1,r=2,s=-1,t=0,u=8;d.prototype.push=function(a,b){var c,d,e=this.strm,f=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?o:n,"string"==typeof a?e.input=j.string2buf(a):"[object ArrayBuffer]"===m.call(a)?e.input=new Uint8Array(a):e.input=a,e.next_in=0,e.avail_in=e.input.length;do{if(0===e.avail_out&&(e.output=new i.Buf8(f),e.next_out=0,e.avail_out=f),c=h.deflate(e,d),c!==q&&c!==p)return this.onEnd(c),this.ended=!0,!1;0!==e.avail_out&&(0!==e.avail_in||d!==o&&d!==r)||("string"===this.options.to?this.onData(j.buf2binstring(i.shrinkBuf(e.output,e.next_out))):this.onData(i.shrinkBuf(e.output,e.next_out)))}while((e.avail_in>0||0===e.avail_out)&&c!==q);return d===o?(c=h.deflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===p):d!==r||(this.onEnd(p),e.avail_out=0,!0)},d.prototype.onData=function(a){this.chunks.push(a)},d.prototype.onEnd=function(a){a===p&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Deflate=d,c.deflate=e,c.deflateRaw=f,c.gzip=g},{"./utils/common":62,"./utils/strings":63,"./zlib/deflate":67,"./zlib/messages":72,"./zlib/zstream":74}],61:[function(a,b,c){"use strict";function d(a){if(!(this instanceof d))return new d(a);this.options=h.assign({chunkSize:16384,windowBits:0,to:""},a||{});var b=this.options;b.raw&&b.windowBits>=0&&b.windowBits<16&&(b.windowBits=-b.windowBits,0===b.windowBits&&(b.windowBits=-15)),!(b.windowBits>=0&&b.windowBits<16)||a&&a.windowBits||(b.windowBits+=32),b.windowBits>15&&b.windowBits<48&&0===(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new l,this.strm.avail_out=0;var c=g.inflateInit2(this.strm,b.windowBits);if(c!==j.Z_OK)throw new Error(k[c]);this.header=new m,g.inflateGetHeader(this.strm,this.header)}function e(a,b){var c=new d(b);if(c.push(a,!0),c.err)throw c.msg||k[c.err];return c.result}function f(a,b){return b=b||{},b.raw=!0,e(a,b)}var g=a("./zlib/inflate"),h=a("./utils/common"),i=a("./utils/strings"),j=a("./zlib/constants"),k=a("./zlib/messages"),l=a("./zlib/zstream"),m=a("./zlib/gzheader"),n=Object.prototype.toString;d.prototype.push=function(a,b){var c,d,e,f,k,l,m=this.strm,o=this.options.chunkSize,p=this.options.dictionary,q=!1;if(this.ended)return!1;d=b===~~b?b:b===!0?j.Z_FINISH:j.Z_NO_FLUSH,"string"==typeof a?m.input=i.binstring2buf(a):"[object ArrayBuffer]"===n.call(a)?m.input=new Uint8Array(a):m.input=a,m.next_in=0,m.avail_in=m.input.length;do{if(0===m.avail_out&&(m.output=new h.Buf8(o),m.next_out=0,m.avail_out=o),c=g.inflate(m,j.Z_NO_FLUSH),c===j.Z_NEED_DICT&&p&&(l="string"==typeof p?i.string2buf(p):"[object ArrayBuffer]"===n.call(p)?new Uint8Array(p):p,c=g.inflateSetDictionary(this.strm,l)),c===j.Z_BUF_ERROR&&q===!0&&(c=j.Z_OK,q=!1),c!==j.Z_STREAM_END&&c!==j.Z_OK)return this.onEnd(c),this.ended=!0,!1;m.next_out&&(0!==m.avail_out&&c!==j.Z_STREAM_END&&(0!==m.avail_in||d!==j.Z_FINISH&&d!==j.Z_SYNC_FLUSH)||("string"===this.options.to?(e=i.utf8border(m.output,m.next_out),f=m.next_out-e,k=i.buf2string(m.output,e),m.next_out=f,m.avail_out=o-f,f&&h.arraySet(m.output,m.output,e,f,0),this.onData(k)):this.onData(h.shrinkBuf(m.output,m.next_out)))),0===m.avail_in&&0===m.avail_out&&(q=!0)}while((m.avail_in>0||0===m.avail_out)&&c!==j.Z_STREAM_END);return c===j.Z_STREAM_END&&(d=j.Z_FINISH),d===j.Z_FINISH?(c=g.inflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===j.Z_OK):d!==j.Z_SYNC_FLUSH||(this.onEnd(j.Z_OK),m.avail_out=0,!0)},d.prototype.onData=function(a){this.chunks.push(a)},d.prototype.onEnd=function(a){a===j.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=h.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Inflate=d,c.inflate=e,c.inflateRaw=f,c.ungzip=e},{"./utils/common":62,"./utils/strings":63,"./zlib/constants":65,"./zlib/gzheader":68,"./zlib/inflate":70,"./zlib/messages":72,"./zlib/zstream":74}],62:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;c.assign=function(a){for(var b=Array.prototype.slice.call(arguments,1);b.length;){var c=b.shift();if(c){if("object"!=typeof c)throw new TypeError(c+"must be non-object");for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}}return a},c.shrinkBuf=function(a,b){return a.length===b?a:a.subarray?a.subarray(0,b):(a.length=b,a)};var e={arraySet:function(a,b,c,d,e){if(b.subarray&&a.subarray)return void a.set(b.subarray(c,c+d),e);for(var f=0;f<d;f++)a[e+f]=b[c+f]},flattenChunks:function(a){var b,c,d,e,f,g;for(d=0,b=0,c=a.length;b<c;b++)d+=a[b].length;for(g=new Uint8Array(d),e=0,b=0,c=a.length;b<c;b++)f=a[b],g.set(f,e),e+=f.length;return g}},f={arraySet:function(a,b,c,d,e){for(var f=0;f<d;f++)a[e+f]=b[c+f]},flattenChunks:function(a){return[].concat.apply([],a)}};c.setTyped=function(a){a?(c.Buf8=Uint8Array,c.Buf16=Uint16Array,c.Buf32=Int32Array,c.assign(c,e)):(c.Buf8=Array,c.Buf16=Array,c.Buf32=Array,c.assign(c,f))},c.setTyped(d)},{}],63:[function(a,b,c){"use strict";function d(a,b){if(b<65537&&(a.subarray&&g||!a.subarray&&f))return String.fromCharCode.apply(null,e.shrinkBuf(a,b));for(var c="",d=0;d<b;d++)c+=String.fromCharCode(a[d]);return c}var e=a("./common"),f=!0,g=!0;try{String.fromCharCode.apply(null,[0])}catch(h){f=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(h){g=!1}for(var i=new e.Buf8(256),j=0;j<256;j++)i[j]=j>=252?6:j>=248?5:j>=240?4:j>=224?3:j>=192?2:1;i[254]=i[254]=1,c.string2buf=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;f<h;f++)c=a.charCodeAt(f),55296===(64512&c)&&f+1<h&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=c<128?1:c<2048?2:c<65536?3:4;for(b=new e.Buf8(i),g=0,f=0;g<i;f++)c=a.charCodeAt(f),55296===(64512&c)&&f+1<h&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),c<128?b[g++]=c:c<2048?(b[g++]=192|c>>>6,b[g++]=128|63&c):c<65536?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},c.buf2binstring=function(a){return d(a,a.length)},c.binstring2buf=function(a){for(var b=new e.Buf8(a.length),c=0,d=b.length;c<d;c++)b[c]=a.charCodeAt(c);return b},c.buf2string=function(a,b){var c,e,f,g,h=b||a.length,j=new Array(2*h);for(e=0,c=0;c<h;)if(f=a[c++],f<128)j[e++]=f;else if(g=i[f],g>4)j[e++]=65533,c+=g-1;else{for(f&=2===g?31:3===g?15:7;g>1&&c<h;)f=f<<6|63&a[c++],g--;g>1?j[e++]=65533:f<65536?j[e++]=f:(f-=65536,j[e++]=55296|f>>10&1023,j[e++]=56320|1023&f)}return d(j,e)},c.utf8border=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return c<0?b:0===c?b:c+i[a[c]]>b?c:b}},{"./common":62}],64:[function(a,b,c){"use strict";function d(a,b,c,d){for(var e=65535&a|0,f=a>>>16&65535|0,g=0;0!==c;){g=c>2e3?2e3:c,c-=g;do e=e+b[d++]|0,f=f+e|0;while(--g);e%=65521,f%=65521}return e|f<<16|0;
}b.exports=d},{}],65:[function(a,b,c){"use strict";b.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],66:[function(a,b,c){"use strict";function d(){for(var a,b=[],c=0;c<256;c++){a=c;for(var d=0;d<8;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function e(a,b,c,d){var e=f,g=d+c;a^=-1;for(var h=d;h<g;h++)a=a>>>8^e[255&(a^b[h])];return a^-1}var f=d();b.exports=e},{}],67:[function(a,b,c){"use strict";function d(a,b){return a.msg=I[b],b}function e(a){return(a<<1)-(a>4?9:0)}function f(a){for(var b=a.length;--b>=0;)a[b]=0}function g(a){var b=a.state,c=b.pending;c>a.avail_out&&(c=a.avail_out),0!==c&&(E.arraySet(a.output,b.pending_buf,b.pending_out,c,a.next_out),a.next_out+=c,b.pending_out+=c,a.total_out+=c,a.avail_out-=c,b.pending-=c,0===b.pending&&(b.pending_out=0))}function h(a,b){F._tr_flush_block(a,a.block_start>=0?a.block_start:-1,a.strstart-a.block_start,b),a.block_start=a.strstart,g(a.strm)}function i(a,b){a.pending_buf[a.pending++]=b}function j(a,b){a.pending_buf[a.pending++]=b>>>8&255,a.pending_buf[a.pending++]=255&b}function k(a,b,c,d){var e=a.avail_in;return e>d&&(e=d),0===e?0:(a.avail_in-=e,E.arraySet(b,a.input,a.next_in,e,c),1===a.state.wrap?a.adler=G(a.adler,b,e,c):2===a.state.wrap&&(a.adler=H(a.adler,b,e,c)),a.next_in+=e,a.total_in+=e,e)}function l(a,b){var c,d,e=a.max_chain_length,f=a.strstart,g=a.prev_length,h=a.nice_match,i=a.strstart>a.w_size-la?a.strstart-(a.w_size-la):0,j=a.window,k=a.w_mask,l=a.prev,m=a.strstart+ka,n=j[f+g-1],o=j[f+g];a.prev_length>=a.good_match&&(e>>=2),h>a.lookahead&&(h=a.lookahead);do if(c=b,j[c+g]===o&&j[c+g-1]===n&&j[c]===j[f]&&j[++c]===j[f+1]){f+=2,c++;do;while(j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&f<m);if(d=ka-(m-f),f=m-ka,d>g){if(a.match_start=b,g=d,d>=h)break;n=j[f+g-1],o=j[f+g]}}while((b=l[b&k])>i&&0!==--e);return g<=a.lookahead?g:a.lookahead}function m(a){var b,c,d,e,f,g=a.w_size;do{if(e=a.window_size-a.lookahead-a.strstart,a.strstart>=g+(g-la)){E.arraySet(a.window,a.window,g,g,0),a.match_start-=g,a.strstart-=g,a.block_start-=g,c=a.hash_size,b=c;do d=a.head[--b],a.head[b]=d>=g?d-g:0;while(--c);c=g,b=c;do d=a.prev[--b],a.prev[b]=d>=g?d-g:0;while(--c);e+=g}if(0===a.strm.avail_in)break;if(c=k(a.strm,a.window,a.strstart+a.lookahead,e),a.lookahead+=c,a.lookahead+a.insert>=ja)for(f=a.strstart-a.insert,a.ins_h=a.window[f],a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+1])&a.hash_mask;a.insert&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+ja-1])&a.hash_mask,a.prev[f&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=f,f++,a.insert--,!(a.lookahead+a.insert<ja)););}while(a.lookahead<la&&0!==a.strm.avail_in)}function n(a,b){var c=65535;for(c>a.pending_buf_size-5&&(c=a.pending_buf_size-5);;){if(a.lookahead<=1){if(m(a),0===a.lookahead&&b===J)return ua;if(0===a.lookahead)break}a.strstart+=a.lookahead,a.lookahead=0;var d=a.block_start+c;if((0===a.strstart||a.strstart>=d)&&(a.lookahead=a.strstart-d,a.strstart=d,h(a,!1),0===a.strm.avail_out))return ua;if(a.strstart-a.block_start>=a.w_size-la&&(h(a,!1),0===a.strm.avail_out))return ua}return a.insert=0,b===M?(h(a,!0),0===a.strm.avail_out?wa:xa):a.strstart>a.block_start&&(h(a,!1),0===a.strm.avail_out)?ua:ua}function o(a,b){for(var c,d;;){if(a.lookahead<la){if(m(a),a.lookahead<la&&b===J)return ua;if(0===a.lookahead)break}if(c=0,a.lookahead>=ja&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+ja-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),0!==c&&a.strstart-c<=a.w_size-la&&(a.match_length=l(a,c)),a.match_length>=ja)if(d=F._tr_tally(a,a.strstart-a.match_start,a.match_length-ja),a.lookahead-=a.match_length,a.match_length<=a.max_lazy_match&&a.lookahead>=ja){a.match_length--;do a.strstart++,a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+ja-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart;while(0!==--a.match_length);a.strstart++}else a.strstart+=a.match_length,a.match_length=0,a.ins_h=a.window[a.strstart],a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+1])&a.hash_mask;else d=F._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++;if(d&&(h(a,!1),0===a.strm.avail_out))return ua}return a.insert=a.strstart<ja-1?a.strstart:ja-1,b===M?(h(a,!0),0===a.strm.avail_out?wa:xa):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?ua:va}function p(a,b){for(var c,d,e;;){if(a.lookahead<la){if(m(a),a.lookahead<la&&b===J)return ua;if(0===a.lookahead)break}if(c=0,a.lookahead>=ja&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+ja-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),a.prev_length=a.match_length,a.prev_match=a.match_start,a.match_length=ja-1,0!==c&&a.prev_length<a.max_lazy_match&&a.strstart-c<=a.w_size-la&&(a.match_length=l(a,c),a.match_length<=5&&(a.strategy===U||a.match_length===ja&&a.strstart-a.match_start>4096)&&(a.match_length=ja-1)),a.prev_length>=ja&&a.match_length<=a.prev_length){e=a.strstart+a.lookahead-ja,d=F._tr_tally(a,a.strstart-1-a.prev_match,a.prev_length-ja),a.lookahead-=a.prev_length-1,a.prev_length-=2;do++a.strstart<=e&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+ja-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart);while(0!==--a.prev_length);if(a.match_available=0,a.match_length=ja-1,a.strstart++,d&&(h(a,!1),0===a.strm.avail_out))return ua}else if(a.match_available){if(d=F._tr_tally(a,0,a.window[a.strstart-1]),d&&h(a,!1),a.strstart++,a.lookahead--,0===a.strm.avail_out)return ua}else a.match_available=1,a.strstart++,a.lookahead--}return a.match_available&&(d=F._tr_tally(a,0,a.window[a.strstart-1]),a.match_available=0),a.insert=a.strstart<ja-1?a.strstart:ja-1,b===M?(h(a,!0),0===a.strm.avail_out?wa:xa):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?ua:va}function q(a,b){for(var c,d,e,f,g=a.window;;){if(a.lookahead<=ka){if(m(a),a.lookahead<=ka&&b===J)return ua;if(0===a.lookahead)break}if(a.match_length=0,a.lookahead>=ja&&a.strstart>0&&(e=a.strstart-1,d=g[e],d===g[++e]&&d===g[++e]&&d===g[++e])){f=a.strstart+ka;do;while(d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&e<f);a.match_length=ka-(f-e),a.match_length>a.lookahead&&(a.match_length=a.lookahead)}if(a.match_length>=ja?(c=F._tr_tally(a,1,a.match_length-ja),a.lookahead-=a.match_length,a.strstart+=a.match_length,a.match_length=0):(c=F._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++),c&&(h(a,!1),0===a.strm.avail_out))return ua}return a.insert=0,b===M?(h(a,!0),0===a.strm.avail_out?wa:xa):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?ua:va}function r(a,b){for(var c;;){if(0===a.lookahead&&(m(a),0===a.lookahead)){if(b===J)return ua;break}if(a.match_length=0,c=F._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++,c&&(h(a,!1),0===a.strm.avail_out))return ua}return a.insert=0,b===M?(h(a,!0),0===a.strm.avail_out?wa:xa):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?ua:va}function s(a,b,c,d,e){this.good_length=a,this.max_lazy=b,this.nice_length=c,this.max_chain=d,this.func=e}function t(a){a.window_size=2*a.w_size,f(a.head),a.max_lazy_match=D[a.level].max_lazy,a.good_match=D[a.level].good_length,a.nice_match=D[a.level].nice_length,a.max_chain_length=D[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=ja-1,a.match_available=0,a.ins_h=0}function u(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=$,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new E.Buf16(2*ha),this.dyn_dtree=new E.Buf16(2*(2*fa+1)),this.bl_tree=new E.Buf16(2*(2*ga+1)),f(this.dyn_ltree),f(this.dyn_dtree),f(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new E.Buf16(ia+1),this.heap=new E.Buf16(2*ea+1),f(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new E.Buf16(2*ea+1),f(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function v(a){var b;return a&&a.state?(a.total_in=a.total_out=0,a.data_type=Z,b=a.state,b.pending=0,b.pending_out=0,b.wrap<0&&(b.wrap=-b.wrap),b.status=b.wrap?na:sa,a.adler=2===b.wrap?0:1,b.last_flush=J,F._tr_init(b),O):d(a,Q)}function w(a){var b=v(a);return b===O&&t(a.state),b}function x(a,b){return a&&a.state?2!==a.state.wrap?Q:(a.state.gzhead=b,O):Q}function y(a,b,c,e,f,g){if(!a)return Q;var h=1;if(b===T&&(b=6),e<0?(h=0,e=-e):e>15&&(h=2,e-=16),f<1||f>_||c!==$||e<8||e>15||b<0||b>9||g<0||g>X)return d(a,Q);8===e&&(e=9);var i=new u;return a.state=i,i.strm=a,i.wrap=h,i.gzhead=null,i.w_bits=e,i.w_size=1<<i.w_bits,i.w_mask=i.w_size-1,i.hash_bits=f+7,i.hash_size=1<<i.hash_bits,i.hash_mask=i.hash_size-1,i.hash_shift=~~((i.hash_bits+ja-1)/ja),i.window=new E.Buf8(2*i.w_size),i.head=new E.Buf16(i.hash_size),i.prev=new E.Buf16(i.w_size),i.lit_bufsize=1<<f+6,i.pending_buf_size=4*i.lit_bufsize,i.pending_buf=new E.Buf8(i.pending_buf_size),i.d_buf=1*i.lit_bufsize,i.l_buf=3*i.lit_bufsize,i.level=b,i.strategy=g,i.method=c,w(a)}function z(a,b){return y(a,b,$,aa,ba,Y)}function A(a,b){var c,h,k,l;if(!a||!a.state||b>N||b<0)return a?d(a,Q):Q;if(h=a.state,!a.output||!a.input&&0!==a.avail_in||h.status===ta&&b!==M)return d(a,0===a.avail_out?S:Q);if(h.strm=a,c=h.last_flush,h.last_flush=b,h.status===na)if(2===h.wrap)a.adler=0,i(h,31),i(h,139),i(h,8),h.gzhead?(i(h,(h.gzhead.text?1:0)+(h.gzhead.hcrc?2:0)+(h.gzhead.extra?4:0)+(h.gzhead.name?8:0)+(h.gzhead.comment?16:0)),i(h,255&h.gzhead.time),i(h,h.gzhead.time>>8&255),i(h,h.gzhead.time>>16&255),i(h,h.gzhead.time>>24&255),i(h,9===h.level?2:h.strategy>=V||h.level<2?4:0),i(h,255&h.gzhead.os),h.gzhead.extra&&h.gzhead.extra.length&&(i(h,255&h.gzhead.extra.length),i(h,h.gzhead.extra.length>>8&255)),h.gzhead.hcrc&&(a.adler=H(a.adler,h.pending_buf,h.pending,0)),h.gzindex=0,h.status=oa):(i(h,0),i(h,0),i(h,0),i(h,0),i(h,0),i(h,9===h.level?2:h.strategy>=V||h.level<2?4:0),i(h,ya),h.status=sa);else{var m=$+(h.w_bits-8<<4)<<8,n=-1;n=h.strategy>=V||h.level<2?0:h.level<6?1:6===h.level?2:3,m|=n<<6,0!==h.strstart&&(m|=ma),m+=31-m%31,h.status=sa,j(h,m),0!==h.strstart&&(j(h,a.adler>>>16),j(h,65535&a.adler)),a.adler=1}if(h.status===oa)if(h.gzhead.extra){for(k=h.pending;h.gzindex<(65535&h.gzhead.extra.length)&&(h.pending!==h.pending_buf_size||(h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending!==h.pending_buf_size));)i(h,255&h.gzhead.extra[h.gzindex]),h.gzindex++;h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),h.gzindex===h.gzhead.extra.length&&(h.gzindex=0,h.status=pa)}else h.status=pa;if(h.status===pa)if(h.gzhead.name){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.name.length?255&h.gzhead.name.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.gzindex=0,h.status=qa)}else h.status=qa;if(h.status===qa)if(h.gzhead.comment){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.comment.length?255&h.gzhead.comment.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=H(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.status=ra)}else h.status=ra;if(h.status===ra&&(h.gzhead.hcrc?(h.pending+2>h.pending_buf_size&&g(a),h.pending+2<=h.pending_buf_size&&(i(h,255&a.adler),i(h,a.adler>>8&255),a.adler=0,h.status=sa)):h.status=sa),0!==h.pending){if(g(a),0===a.avail_out)return h.last_flush=-1,O}else if(0===a.avail_in&&e(b)<=e(c)&&b!==M)return d(a,S);if(h.status===ta&&0!==a.avail_in)return d(a,S);if(0!==a.avail_in||0!==h.lookahead||b!==J&&h.status!==ta){var o=h.strategy===V?r(h,b):h.strategy===W?q(h,b):D[h.level].func(h,b);if(o!==wa&&o!==xa||(h.status=ta),o===ua||o===wa)return 0===a.avail_out&&(h.last_flush=-1),O;if(o===va&&(b===K?F._tr_align(h):b!==N&&(F._tr_stored_block(h,0,0,!1),b===L&&(f(h.head),0===h.lookahead&&(h.strstart=0,h.block_start=0,h.insert=0))),g(a),0===a.avail_out))return h.last_flush=-1,O}return b!==M?O:h.wrap<=0?P:(2===h.wrap?(i(h,255&a.adler),i(h,a.adler>>8&255),i(h,a.adler>>16&255),i(h,a.adler>>24&255),i(h,255&a.total_in),i(h,a.total_in>>8&255),i(h,a.total_in>>16&255),i(h,a.total_in>>24&255)):(j(h,a.adler>>>16),j(h,65535&a.adler)),g(a),h.wrap>0&&(h.wrap=-h.wrap),0!==h.pending?O:P)}function B(a){var b;return a&&a.state?(b=a.state.status,b!==na&&b!==oa&&b!==pa&&b!==qa&&b!==ra&&b!==sa&&b!==ta?d(a,Q):(a.state=null,b===sa?d(a,R):O)):Q}function C(a,b){var c,d,e,g,h,i,j,k,l=b.length;if(!a||!a.state)return Q;if(c=a.state,g=c.wrap,2===g||1===g&&c.status!==na||c.lookahead)return Q;for(1===g&&(a.adler=G(a.adler,b,l,0)),c.wrap=0,l>=c.w_size&&(0===g&&(f(c.head),c.strstart=0,c.block_start=0,c.insert=0),k=new E.Buf8(c.w_size),E.arraySet(k,b,l-c.w_size,c.w_size,0),b=k,l=c.w_size),h=a.avail_in,i=a.next_in,j=a.input,a.avail_in=l,a.next_in=0,a.input=b,m(c);c.lookahead>=ja;){d=c.strstart,e=c.lookahead-(ja-1);do c.ins_h=(c.ins_h<<c.hash_shift^c.window[d+ja-1])&c.hash_mask,c.prev[d&c.w_mask]=c.head[c.ins_h],c.head[c.ins_h]=d,d++;while(--e);c.strstart=d,c.lookahead=ja-1,m(c)}return c.strstart+=c.lookahead,c.block_start=c.strstart,c.insert=c.lookahead,c.lookahead=0,c.match_length=c.prev_length=ja-1,c.match_available=0,a.next_in=i,a.input=j,a.avail_in=h,c.wrap=g,O}var D,E=a("../utils/common"),F=a("./trees"),G=a("./adler32"),H=a("./crc32"),I=a("./messages"),J=0,K=1,L=3,M=4,N=5,O=0,P=1,Q=-2,R=-3,S=-5,T=-1,U=1,V=2,W=3,X=4,Y=0,Z=2,$=8,_=9,aa=15,ba=8,ca=29,da=256,ea=da+1+ca,fa=30,ga=19,ha=2*ea+1,ia=15,ja=3,ka=258,la=ka+ja+1,ma=32,na=42,oa=69,pa=73,qa=91,ra=103,sa=113,ta=666,ua=1,va=2,wa=3,xa=4,ya=3;D=[new s(0,0,0,0,n),new s(4,4,8,4,o),new s(4,5,16,8,o),new s(4,6,32,32,o),new s(4,4,16,16,p),new s(8,16,32,32,p),new s(8,16,128,128,p),new s(8,32,128,256,p),new s(32,128,258,1024,p),new s(32,258,258,4096,p)],c.deflateInit=z,c.deflateInit2=y,c.deflateReset=w,c.deflateResetKeep=v,c.deflateSetHeader=x,c.deflate=A,c.deflateEnd=B,c.deflateSetDictionary=C,c.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":62,"./adler32":64,"./crc32":66,"./messages":72,"./trees":73}],68:[function(a,b,c){"use strict";function d(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}b.exports=d},{}],69:[function(a,b,c){"use strict";var d=30,e=12;b.exports=function(a,b){var c,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;c=a.state,f=a.next_in,B=a.input,g=f+(a.avail_in-5),h=a.next_out,C=a.output,i=h-(b-a.avail_out),j=h+(a.avail_out-257),k=c.dmax,l=c.wsize,m=c.whave,n=c.wnext,o=c.window,p=c.hold,q=c.bits,r=c.lencode,s=c.distcode,t=(1<<c.lenbits)-1,u=(1<<c.distbits)-1;a:do{q<15&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=r[p&t];b:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,0===w)C[h++]=65535&v;else{if(!(16&w)){if(0===(64&w)){v=r[(65535&v)+(p&(1<<w)-1)];continue b}if(32&w){c.mode=e;break a}a.msg="invalid literal/length code",c.mode=d;break a}x=65535&v,w&=15,w&&(q<w&&(p+=B[f++]<<q,q+=8),x+=p&(1<<w)-1,p>>>=w,q-=w),q<15&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=s[p&u];c:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,!(16&w)){if(0===(64&w)){v=s[(65535&v)+(p&(1<<w)-1)];continue c}a.msg="invalid distance code",c.mode=d;break a}if(y=65535&v,w&=15,q<w&&(p+=B[f++]<<q,q+=8,q<w&&(p+=B[f++]<<q,q+=8)),y+=p&(1<<w)-1,y>k){a.msg="invalid distance too far back",c.mode=d;break a}if(p>>>=w,q-=w,w=h-i,y>w){if(w=y-w,w>m&&c.sane){a.msg="invalid distance too far back",c.mode=d;break a}if(z=0,A=o,0===n){if(z+=l-w,w<x){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}else if(n<w){if(z+=l+n-w,w-=n,w<x){x-=w;do C[h++]=o[z++];while(--w);if(z=0,n<x){w=n,x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}}else if(z+=n-w,w<x){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}for(;x>2;)C[h++]=A[z++],C[h++]=A[z++],C[h++]=A[z++],x-=3;x&&(C[h++]=A[z++],x>1&&(C[h++]=A[z++]))}else{z=h-y;do C[h++]=C[z++],C[h++]=C[z++],C[h++]=C[z++],x-=3;while(x>2);x&&(C[h++]=C[z++],x>1&&(C[h++]=C[z++]))}break}}break}}while(f<g&&h<j);x=q>>3,f-=x,q-=x<<3,p&=(1<<q)-1,a.next_in=f,a.next_out=h,a.avail_in=f<g?5+(g-f):5-(f-g),a.avail_out=h<j?257+(j-h):257-(h-j),c.hold=p,c.bits=q}},{}],70:[function(a,b,c){"use strict";function d(a){return(a>>>24&255)+(a>>>8&65280)+((65280&a)<<8)+((255&a)<<24)}function e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new s.Buf16(320),this.work=new s.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function f(a){var b;return a&&a.state?(b=a.state,a.total_in=a.total_out=b.total=0,a.msg="",b.wrap&&(a.adler=1&b.wrap),b.mode=L,b.last=0,b.havedict=0,b.dmax=32768,b.head=null,b.hold=0,b.bits=0,b.lencode=b.lendyn=new s.Buf32(pa),b.distcode=b.distdyn=new s.Buf32(qa),b.sane=1,b.back=-1,D):G}function g(a){var b;return a&&a.state?(b=a.state,b.wsize=0,b.whave=0,b.wnext=0,f(a)):G}function h(a,b){var c,d;return a&&a.state?(d=a.state,b<0?(c=0,b=-b):(c=(b>>4)+1,b<48&&(b&=15)),b&&(b<8||b>15)?G:(null!==d.window&&d.wbits!==b&&(d.window=null),d.wrap=c,d.wbits=b,g(a))):G}function i(a,b){var c,d;return a?(d=new e,a.state=d,d.window=null,c=h(a,b),c!==D&&(a.state=null),c):G}function j(a){return i(a,sa)}function k(a){if(ta){var b;for(q=new s.Buf32(512),r=new s.Buf32(32),b=0;b<144;)a.lens[b++]=8;for(;b<256;)a.lens[b++]=9;for(;b<280;)a.lens[b++]=7;for(;b<288;)a.lens[b++]=8;for(w(y,a.lens,0,288,q,0,a.work,{bits:9}),b=0;b<32;)a.lens[b++]=5;w(z,a.lens,0,32,r,0,a.work,{bits:5}),ta=!1}a.lencode=q,a.lenbits=9,a.distcode=r,a.distbits=5}function l(a,b,c,d){var e,f=a.state;return null===f.window&&(f.wsize=1<<f.wbits,f.wnext=0,f.whave=0,f.window=new s.Buf8(f.wsize)),d>=f.wsize?(s.arraySet(f.window,b,c-f.wsize,f.wsize,0),f.wnext=0,f.whave=f.wsize):(e=f.wsize-f.wnext,e>d&&(e=d),s.arraySet(f.window,b,c-d,e,f.wnext),d-=e,d?(s.arraySet(f.window,b,c-d,d,0),f.wnext=d,f.whave=f.wsize):(f.wnext+=e,f.wnext===f.wsize&&(f.wnext=0),f.whave<f.wsize&&(f.whave+=e))),0}function m(a,b){var c,e,f,g,h,i,j,m,n,o,p,q,r,pa,qa,ra,sa,ta,ua,va,wa,xa,ya,za,Aa=0,Ba=new s.Buf8(4),Ca=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!a||!a.state||!a.output||!a.input&&0!==a.avail_in)return G;c=a.state,c.mode===W&&(c.mode=X),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,o=i,p=j,xa=D;a:for(;;)switch(c.mode){case L:if(0===c.wrap){c.mode=X;break}for(;n<16;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(2&c.wrap&&35615===m){c.check=0,Ba[0]=255&m,Ba[1]=m>>>8&255,c.check=u(c.check,Ba,2,0),m=0,n=0,c.mode=M;break}if(c.flags=0,c.head&&(c.head.done=!1),!(1&c.wrap)||(((255&m)<<8)+(m>>8))%31){a.msg="incorrect header check",c.mode=ma;break}if((15&m)!==K){a.msg="unknown compression method",c.mode=ma;break}if(m>>>=4,n-=4,wa=(15&m)+8,0===c.wbits)c.wbits=wa;else if(wa>c.wbits){a.msg="invalid window size",c.mode=ma;break}c.dmax=1<<wa,a.adler=c.check=1,c.mode=512&m?U:W,m=0,n=0;break;case M:for(;n<16;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.flags=m,(255&c.flags)!==K){a.msg="unknown compression method",c.mode=ma;break}if(57344&c.flags){a.msg="unknown header flags set",c.mode=ma;break}c.head&&(c.head.text=m>>8&1),512&c.flags&&(Ba[0]=255&m,Ba[1]=m>>>8&255,c.check=u(c.check,Ba,2,0)),m=0,n=0,c.mode=N;case N:for(;n<32;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.time=m),512&c.flags&&(Ba[0]=255&m,Ba[1]=m>>>8&255,Ba[2]=m>>>16&255,Ba[3]=m>>>24&255,c.check=u(c.check,Ba,4,0)),m=0,n=0,c.mode=O;case O:for(;n<16;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.xflags=255&m,c.head.os=m>>8),512&c.flags&&(Ba[0]=255&m,Ba[1]=m>>>8&255,c.check=u(c.check,Ba,2,0)),m=0,n=0,c.mode=P;case P:if(1024&c.flags){for(;n<16;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length=m,c.head&&(c.head.extra_len=m),512&c.flags&&(Ba[0]=255&m,Ba[1]=m>>>8&255,c.check=u(c.check,Ba,2,0)),m=0,n=0}else c.head&&(c.head.extra=null);c.mode=Q;case Q:if(1024&c.flags&&(q=c.length,q>i&&(q=i),q&&(c.head&&(wa=c.head.extra_len-c.length,c.head.extra||(c.head.extra=new Array(c.head.extra_len)),s.arraySet(c.head.extra,e,g,q,wa)),512&c.flags&&(c.check=u(c.check,e,q,g)),i-=q,g+=q,c.length-=q),c.length))break a;c.length=0,c.mode=R;case R:if(2048&c.flags){if(0===i)break a;q=0;do wa=e[g+q++],c.head&&wa&&c.length<65536&&(c.head.name+=String.fromCharCode(wa));while(wa&&q<i);if(512&c.flags&&(c.check=u(c.check,e,q,g)),i-=q,g+=q,wa)break a}else c.head&&(c.head.name=null);c.length=0,c.mode=S;case S:if(4096&c.flags){if(0===i)break a;q=0;do wa=e[g+q++],c.head&&wa&&c.length<65536&&(c.head.comment+=String.fromCharCode(wa));while(wa&&q<i);if(512&c.flags&&(c.check=u(c.check,e,q,g)),i-=q,g+=q,wa)break a}else c.head&&(c.head.comment=null);c.mode=T;case T:if(512&c.flags){for(;n<16;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(65535&c.check)){a.msg="header crc mismatch",c.mode=ma;break}m=0,n=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=!0),a.adler=c.check=0,c.mode=W;break;case U:for(;n<32;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}a.adler=c.check=d(m),m=0,n=0,c.mode=V;case V:if(0===c.havedict)return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,F;a.adler=c.check=1,c.mode=W;case W:if(b===B||b===C)break a;case X:if(c.last){m>>>=7&n,n-=7&n,c.mode=ja;break}for(;n<3;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}switch(c.last=1&m,m>>>=1,n-=1,3&m){case 0:c.mode=Y;break;case 1:if(k(c),c.mode=ca,b===C){m>>>=2,n-=2;break a}break;case 2:c.mode=_;break;case 3:a.msg="invalid block type",c.mode=ma}m>>>=2,n-=2;break;case Y:for(m>>>=7&n,n-=7&n;n<32;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if((65535&m)!==(m>>>16^65535)){a.msg="invalid stored block lengths",c.mode=ma;break}if(c.length=65535&m,m=0,n=0,c.mode=Z,b===C)break a;case Z:c.mode=$;case $:if(q=c.length){if(q>i&&(q=i),q>j&&(q=j),0===q)break a;s.arraySet(f,e,g,q,h),i-=q,g+=q,j-=q,h+=q,c.length-=q;break}c.mode=W;break;case _:for(;n<14;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.nlen=(31&m)+257,m>>>=5,n-=5,c.ndist=(31&m)+1,m>>>=5,n-=5,c.ncode=(15&m)+4,m>>>=4,n-=4,c.nlen>286||c.ndist>30){a.msg="too many length or distance symbols",c.mode=ma;break}c.have=0,c.mode=aa;case aa:for(;c.have<c.ncode;){for(;n<3;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.lens[Ca[c.have++]]=7&m,m>>>=3,n-=3}for(;c.have<19;)c.lens[Ca[c.have++]]=0;if(c.lencode=c.lendyn,c.lenbits=7,ya={bits:c.lenbits},xa=w(x,c.lens,0,19,c.lencode,0,c.work,ya),c.lenbits=ya.bits,xa){a.msg="invalid code lengths set",c.mode=ma;break}c.have=0,c.mode=ba;case ba:for(;c.have<c.nlen+c.ndist;){for(;Aa=c.lencode[m&(1<<c.lenbits)-1],qa=Aa>>>24,ra=Aa>>>16&255,sa=65535&Aa,!(qa<=n);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(sa<16)m>>>=qa,n-=qa,c.lens[c.have++]=sa;else{if(16===sa){for(za=qa+2;n<za;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m>>>=qa,n-=qa,0===c.have){a.msg="invalid bit length repeat",c.mode=ma;break}wa=c.lens[c.have-1],q=3+(3&m),m>>>=2,n-=2}else if(17===sa){for(za=qa+3;n<za;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qa,n-=qa,wa=0,q=3+(7&m),m>>>=3,n-=3}else{for(za=qa+7;n<za;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qa,n-=qa,wa=0,q=11+(127&m),m>>>=7,n-=7}if(c.have+q>c.nlen+c.ndist){a.msg="invalid bit length repeat",c.mode=ma;break}for(;q--;)c.lens[c.have++]=wa}}if(c.mode===ma)break;if(0===c.lens[256]){a.msg="invalid code -- missing end-of-block",c.mode=ma;break}if(c.lenbits=9,ya={bits:c.lenbits},xa=w(y,c.lens,0,c.nlen,c.lencode,0,c.work,ya),c.lenbits=ya.bits,xa){a.msg="invalid literal/lengths set",c.mode=ma;break}if(c.distbits=6,c.distcode=c.distdyn,ya={bits:c.distbits},xa=w(z,c.lens,c.nlen,c.ndist,c.distcode,0,c.work,ya),c.distbits=ya.bits,xa){a.msg="invalid distances set",c.mode=ma;break}if(c.mode=ca,b===C)break a;case ca:c.mode=da;case da:if(i>=6&&j>=258){a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,v(a,p),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,c.mode===W&&(c.back=-1);break}for(c.back=0;Aa=c.lencode[m&(1<<c.lenbits)-1],qa=Aa>>>24,ra=Aa>>>16&255,sa=65535&Aa,!(qa<=n);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(ra&&0===(240&ra)){for(ta=qa,ua=ra,va=sa;Aa=c.lencode[va+((m&(1<<ta+ua)-1)>>ta)],qa=Aa>>>24,ra=Aa>>>16&255,sa=65535&Aa,!(ta+qa<=n);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=ta,n-=ta,c.back+=ta}if(m>>>=qa,n-=qa,c.back+=qa,c.length=sa,0===ra){c.mode=ia;break}if(32&ra){c.back=-1,c.mode=W;break}if(64&ra){a.msg="invalid literal/length code",c.mode=ma;break}c.extra=15&ra,c.mode=ea;case ea:if(c.extra){for(za=c.extra;n<za;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=fa;case fa:for(;Aa=c.distcode[m&(1<<c.distbits)-1],qa=Aa>>>24,ra=Aa>>>16&255,sa=65535&Aa,!(qa<=n);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(0===(240&ra)){for(ta=qa,ua=ra,va=sa;Aa=c.distcode[va+((m&(1<<ta+ua)-1)>>ta)],qa=Aa>>>24,ra=Aa>>>16&255,sa=65535&Aa,!(ta+qa<=n);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=ta,n-=ta,c.back+=ta}if(m>>>=qa,n-=qa,c.back+=qa,64&ra){a.msg="invalid distance code",c.mode=ma;break}c.offset=sa,c.extra=15&ra,c.mode=ga;case ga:if(c.extra){for(za=c.extra;n<za;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.offset+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){a.msg="invalid distance too far back",c.mode=ma;break}c.mode=ha;case ha:if(0===j)break a;if(q=p-j,c.offset>q){if(q=c.offset-q,q>c.whave&&c.sane){a.msg="invalid distance too far back",c.mode=ma;break}q>c.wnext?(q-=c.wnext,r=c.wsize-q):r=c.wnext-q,q>c.length&&(q=c.length),pa=c.window}else pa=f,r=h-c.offset,q=c.length;q>j&&(q=j),j-=q,c.length-=q;do f[h++]=pa[r++];while(--q);0===c.length&&(c.mode=da);break;case ia:if(0===j)break a;f[h++]=c.length,j--,c.mode=da;break;case ja:if(c.wrap){for(;n<32;){if(0===i)break a;i--,m|=e[g++]<<n,n+=8}if(p-=j,a.total_out+=p,c.total+=p,p&&(a.adler=c.check=c.flags?u(c.check,f,p,h-p):t(c.check,f,p,h-p)),p=j,(c.flags?m:d(m))!==c.check){a.msg="incorrect data check",c.mode=ma;break}m=0,n=0}c.mode=ka;case ka:if(c.wrap&&c.flags){for(;n<32;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(4294967295&c.total)){a.msg="incorrect length check",c.mode=ma;break}m=0,n=0}c.mode=la;case la:xa=E;break a;case ma:xa=H;break a;case na:return I;case oa:default:return G}return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,(c.wsize||p!==a.avail_out&&c.mode<ma&&(c.mode<ja||b!==A))&&l(a,a.output,a.next_out,p-a.avail_out)?(c.mode=na,I):(o-=a.avail_in,p-=a.avail_out,a.total_in+=o,a.total_out+=p,c.total+=p,c.wrap&&p&&(a.adler=c.check=c.flags?u(c.check,f,p,a.next_out-p):t(c.check,f,p,a.next_out-p)),a.data_type=c.bits+(c.last?64:0)+(c.mode===W?128:0)+(c.mode===ca||c.mode===Z?256:0),(0===o&&0===p||b===A)&&xa===D&&(xa=J),xa)}function n(a){if(!a||!a.state)return G;var b=a.state;return b.window&&(b.window=null),a.state=null,D}function o(a,b){var c;return a&&a.state?(c=a.state,0===(2&c.wrap)?G:(c.head=b,b.done=!1,D)):G}function p(a,b){var c,d,e,f=b.length;return a&&a.state?(c=a.state,0!==c.wrap&&c.mode!==V?G:c.mode===V&&(d=1,d=t(d,b,f,0),d!==c.check)?H:(e=l(a,b,f,f))?(c.mode=na,I):(c.havedict=1,D)):G}var q,r,s=a("../utils/common"),t=a("./adler32"),u=a("./crc32"),v=a("./inffast"),w=a("./inftrees"),x=0,y=1,z=2,A=4,B=5,C=6,D=0,E=1,F=2,G=-2,H=-3,I=-4,J=-5,K=8,L=1,M=2,N=3,O=4,P=5,Q=6,R=7,S=8,T=9,U=10,V=11,W=12,X=13,Y=14,Z=15,$=16,_=17,aa=18,ba=19,ca=20,da=21,ea=22,fa=23,ga=24,ha=25,ia=26,ja=27,ka=28,la=29,ma=30,na=31,oa=32,pa=852,qa=592,ra=15,sa=ra,ta=!0;c.inflateReset=g,c.inflateReset2=h,c.inflateResetKeep=f,c.inflateInit=j,c.inflateInit2=i,c.inflate=m,c.inflateEnd=n,c.inflateGetHeader=o,c.inflateSetDictionary=p,c.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":62,"./adler32":64,"./crc32":66,"./inffast":69,"./inftrees":71}],71:[function(a,b,c){"use strict";var d=a("../utils/common"),e=15,f=852,g=592,h=0,i=1,j=2,k=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],l=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],m=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],n=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];b.exports=function(a,b,c,o,p,q,r,s){var t,u,v,w,x,y,z,A,B,C=s.bits,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=null,O=0,P=new d.Buf16(e+1),Q=new d.Buf16(e+1),R=null,S=0;for(D=0;D<=e;D++)P[D]=0;for(E=0;E<o;E++)P[b[c+E]]++;for(H=C,G=e;G>=1&&0===P[G];G--);if(H>G&&(H=G),0===G)return p[q++]=20971520,p[q++]=20971520,s.bits=1,0;for(F=1;F<G&&0===P[F];F++);for(H<F&&(H=F),K=1,D=1;D<=e;D++)if(K<<=1,K-=P[D],K<0)return-1;if(K>0&&(a===h||1!==G))return-1;for(Q[1]=0,D=1;D<e;D++)Q[D+1]=Q[D]+P[D];for(E=0;E<o;E++)0!==b[c+E]&&(r[Q[b[c+E]]++]=E);if(a===h?(N=R=r,y=19):a===i?(N=k,O-=257,R=l,S-=257,y=256):(N=m,R=n,y=-1),M=0,E=0,D=F,x=q,I=H,J=0,v=-1,L=1<<H,w=L-1,a===i&&L>f||a===j&&L>g)return 1;for(;;){z=D-J,r[E]<y?(A=0,B=r[E]):r[E]>y?(A=R[S+r[E]],B=N[O+r[E]]):(A=96,B=0),t=1<<D-J,u=1<<I,F=u;do u-=t,p[x+(M>>J)+u]=z<<24|A<<16|B|0;while(0!==u);for(t=1<<D-1;M&t;)t>>=1;if(0!==t?(M&=t-1,M+=t):M=0,E++,0===--P[D]){if(D===G)break;D=b[c+r[E]]}if(D>H&&(M&w)!==v){for(0===J&&(J=H),x+=F,I=D-J,K=1<<I;I+J<G&&(K-=P[I+J],!(K<=0));)I++,K<<=1;if(L+=1<<I,a===i&&L>f||a===j&&L>g)return 1;v=M&w,p[v]=H<<24|I<<16|x-q|0}}return 0!==M&&(p[x+M]=D-J<<24|64<<16|0),s.bits=H,0}},{"../utils/common":62}],72:[function(a,b,c){"use strict";b.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],73:[function(a,b,c){"use strict";function d(a){for(var b=a.length;--b>=0;)a[b]=0}function e(a,b,c,d,e){this.static_tree=a,this.extra_bits=b,this.extra_base=c,this.elems=d,this.max_length=e,this.has_stree=a&&a.length}function f(a,b){this.dyn_tree=a,this.max_code=0,this.stat_desc=b}function g(a){return a<256?ia[a]:ia[256+(a>>>7)]}function h(a,b){a.pending_buf[a.pending++]=255&b,a.pending_buf[a.pending++]=b>>>8&255}function i(a,b,c){a.bi_valid>X-c?(a.bi_buf|=b<<a.bi_valid&65535,h(a,a.bi_buf),a.bi_buf=b>>X-a.bi_valid,a.bi_valid+=c-X):(a.bi_buf|=b<<a.bi_valid&65535,a.bi_valid+=c)}function j(a,b,c){i(a,c[2*b],c[2*b+1])}function k(a,b){var c=0;do c|=1&a,a>>>=1,c<<=1;while(--b>0);return c>>>1}function l(a){16===a.bi_valid?(h(a,a.bi_buf),a.bi_buf=0,a.bi_valid=0):a.bi_valid>=8&&(a.pending_buf[a.pending++]=255&a.bi_buf,a.bi_buf>>=8,a.bi_valid-=8)}function m(a,b){var c,d,e,f,g,h,i=b.dyn_tree,j=b.max_code,k=b.stat_desc.static_tree,l=b.stat_desc.has_stree,m=b.stat_desc.extra_bits,n=b.stat_desc.extra_base,o=b.stat_desc.max_length,p=0;for(f=0;f<=W;f++)a.bl_count[f]=0;for(i[2*a.heap[a.heap_max]+1]=0,
c=a.heap_max+1;c<V;c++)d=a.heap[c],f=i[2*i[2*d+1]+1]+1,f>o&&(f=o,p++),i[2*d+1]=f,d>j||(a.bl_count[f]++,g=0,d>=n&&(g=m[d-n]),h=i[2*d],a.opt_len+=h*(f+g),l&&(a.static_len+=h*(k[2*d+1]+g)));if(0!==p){do{for(f=o-1;0===a.bl_count[f];)f--;a.bl_count[f]--,a.bl_count[f+1]+=2,a.bl_count[o]--,p-=2}while(p>0);for(f=o;0!==f;f--)for(d=a.bl_count[f];0!==d;)e=a.heap[--c],e>j||(i[2*e+1]!==f&&(a.opt_len+=(f-i[2*e+1])*i[2*e],i[2*e+1]=f),d--)}}function n(a,b,c){var d,e,f=new Array(W+1),g=0;for(d=1;d<=W;d++)f[d]=g=g+c[d-1]<<1;for(e=0;e<=b;e++){var h=a[2*e+1];0!==h&&(a[2*e]=k(f[h]++,h))}}function o(){var a,b,c,d,f,g=new Array(W+1);for(c=0,d=0;d<Q-1;d++)for(ka[d]=c,a=0;a<1<<ba[d];a++)ja[c++]=d;for(ja[c-1]=d,f=0,d=0;d<16;d++)for(la[d]=f,a=0;a<1<<ca[d];a++)ia[f++]=d;for(f>>=7;d<T;d++)for(la[d]=f<<7,a=0;a<1<<ca[d]-7;a++)ia[256+f++]=d;for(b=0;b<=W;b++)g[b]=0;for(a=0;a<=143;)ga[2*a+1]=8,a++,g[8]++;for(;a<=255;)ga[2*a+1]=9,a++,g[9]++;for(;a<=279;)ga[2*a+1]=7,a++,g[7]++;for(;a<=287;)ga[2*a+1]=8,a++,g[8]++;for(n(ga,S+1,g),a=0;a<T;a++)ha[2*a+1]=5,ha[2*a]=k(a,5);ma=new e(ga,ba,R+1,S,W),na=new e(ha,ca,0,T,W),oa=new e(new Array(0),da,0,U,Y)}function p(a){var b;for(b=0;b<S;b++)a.dyn_ltree[2*b]=0;for(b=0;b<T;b++)a.dyn_dtree[2*b]=0;for(b=0;b<U;b++)a.bl_tree[2*b]=0;a.dyn_ltree[2*Z]=1,a.opt_len=a.static_len=0,a.last_lit=a.matches=0}function q(a){a.bi_valid>8?h(a,a.bi_buf):a.bi_valid>0&&(a.pending_buf[a.pending++]=a.bi_buf),a.bi_buf=0,a.bi_valid=0}function r(a,b,c,d){q(a),d&&(h(a,c),h(a,~c)),G.arraySet(a.pending_buf,a.window,b,c,a.pending),a.pending+=c}function s(a,b,c,d){var e=2*b,f=2*c;return a[e]<a[f]||a[e]===a[f]&&d[b]<=d[c]}function t(a,b,c){for(var d=a.heap[c],e=c<<1;e<=a.heap_len&&(e<a.heap_len&&s(b,a.heap[e+1],a.heap[e],a.depth)&&e++,!s(b,d,a.heap[e],a.depth));)a.heap[c]=a.heap[e],c=e,e<<=1;a.heap[c]=d}function u(a,b,c){var d,e,f,h,k=0;if(0!==a.last_lit)do d=a.pending_buf[a.d_buf+2*k]<<8|a.pending_buf[a.d_buf+2*k+1],e=a.pending_buf[a.l_buf+k],k++,0===d?j(a,e,b):(f=ja[e],j(a,f+R+1,b),h=ba[f],0!==h&&(e-=ka[f],i(a,e,h)),d--,f=g(d),j(a,f,c),h=ca[f],0!==h&&(d-=la[f],i(a,d,h)));while(k<a.last_lit);j(a,Z,b)}function v(a,b){var c,d,e,f=b.dyn_tree,g=b.stat_desc.static_tree,h=b.stat_desc.has_stree,i=b.stat_desc.elems,j=-1;for(a.heap_len=0,a.heap_max=V,c=0;c<i;c++)0!==f[2*c]?(a.heap[++a.heap_len]=j=c,a.depth[c]=0):f[2*c+1]=0;for(;a.heap_len<2;)e=a.heap[++a.heap_len]=j<2?++j:0,f[2*e]=1,a.depth[e]=0,a.opt_len--,h&&(a.static_len-=g[2*e+1]);for(b.max_code=j,c=a.heap_len>>1;c>=1;c--)t(a,f,c);e=i;do c=a.heap[1],a.heap[1]=a.heap[a.heap_len--],t(a,f,1),d=a.heap[1],a.heap[--a.heap_max]=c,a.heap[--a.heap_max]=d,f[2*e]=f[2*c]+f[2*d],a.depth[e]=(a.depth[c]>=a.depth[d]?a.depth[c]:a.depth[d])+1,f[2*c+1]=f[2*d+1]=e,a.heap[1]=e++,t(a,f,1);while(a.heap_len>=2);a.heap[--a.heap_max]=a.heap[1],m(a,b),n(f,j,a.bl_count)}function w(a,b,c){var d,e,f=-1,g=b[1],h=0,i=7,j=4;for(0===g&&(i=138,j=3),b[2*(c+1)+1]=65535,d=0;d<=c;d++)e=g,g=b[2*(d+1)+1],++h<i&&e===g||(h<j?a.bl_tree[2*e]+=h:0!==e?(e!==f&&a.bl_tree[2*e]++,a.bl_tree[2*$]++):h<=10?a.bl_tree[2*_]++:a.bl_tree[2*aa]++,h=0,f=e,0===g?(i=138,j=3):e===g?(i=6,j=3):(i=7,j=4))}function x(a,b,c){var d,e,f=-1,g=b[1],h=0,k=7,l=4;for(0===g&&(k=138,l=3),d=0;d<=c;d++)if(e=g,g=b[2*(d+1)+1],!(++h<k&&e===g)){if(h<l){do j(a,e,a.bl_tree);while(0!==--h)}else 0!==e?(e!==f&&(j(a,e,a.bl_tree),h--),j(a,$,a.bl_tree),i(a,h-3,2)):h<=10?(j(a,_,a.bl_tree),i(a,h-3,3)):(j(a,aa,a.bl_tree),i(a,h-11,7));h=0,f=e,0===g?(k=138,l=3):e===g?(k=6,l=3):(k=7,l=4)}}function y(a){var b;for(w(a,a.dyn_ltree,a.l_desc.max_code),w(a,a.dyn_dtree,a.d_desc.max_code),v(a,a.bl_desc),b=U-1;b>=3&&0===a.bl_tree[2*ea[b]+1];b--);return a.opt_len+=3*(b+1)+5+5+4,b}function z(a,b,c,d){var e;for(i(a,b-257,5),i(a,c-1,5),i(a,d-4,4),e=0;e<d;e++)i(a,a.bl_tree[2*ea[e]+1],3);x(a,a.dyn_ltree,b-1),x(a,a.dyn_dtree,c-1)}function A(a){var b,c=4093624447;for(b=0;b<=31;b++,c>>>=1)if(1&c&&0!==a.dyn_ltree[2*b])return I;if(0!==a.dyn_ltree[18]||0!==a.dyn_ltree[20]||0!==a.dyn_ltree[26])return J;for(b=32;b<R;b++)if(0!==a.dyn_ltree[2*b])return J;return I}function B(a){pa||(o(),pa=!0),a.l_desc=new f(a.dyn_ltree,ma),a.d_desc=new f(a.dyn_dtree,na),a.bl_desc=new f(a.bl_tree,oa),a.bi_buf=0,a.bi_valid=0,p(a)}function C(a,b,c,d){i(a,(L<<1)+(d?1:0),3),r(a,b,c,!0)}function D(a){i(a,M<<1,3),j(a,Z,ga),l(a)}function E(a,b,c,d){var e,f,g=0;a.level>0?(a.strm.data_type===K&&(a.strm.data_type=A(a)),v(a,a.l_desc),v(a,a.d_desc),g=y(a),e=a.opt_len+3+7>>>3,f=a.static_len+3+7>>>3,f<=e&&(e=f)):e=f=c+5,c+4<=e&&b!==-1?C(a,b,c,d):a.strategy===H||f===e?(i(a,(M<<1)+(d?1:0),3),u(a,ga,ha)):(i(a,(N<<1)+(d?1:0),3),z(a,a.l_desc.max_code+1,a.d_desc.max_code+1,g+1),u(a,a.dyn_ltree,a.dyn_dtree)),p(a),d&&q(a)}function F(a,b,c){return a.pending_buf[a.d_buf+2*a.last_lit]=b>>>8&255,a.pending_buf[a.d_buf+2*a.last_lit+1]=255&b,a.pending_buf[a.l_buf+a.last_lit]=255&c,a.last_lit++,0===b?a.dyn_ltree[2*c]++:(a.matches++,b--,a.dyn_ltree[2*(ja[c]+R+1)]++,a.dyn_dtree[2*g(b)]++),a.last_lit===a.lit_bufsize-1}var G=a("../utils/common"),H=4,I=0,J=1,K=2,L=0,M=1,N=2,O=3,P=258,Q=29,R=256,S=R+1+Q,T=30,U=19,V=2*S+1,W=15,X=16,Y=7,Z=256,$=16,_=17,aa=18,ba=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ca=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],da=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],ea=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],fa=512,ga=new Array(2*(S+2));d(ga);var ha=new Array(2*T);d(ha);var ia=new Array(fa);d(ia);var ja=new Array(P-O+1);d(ja);var ka=new Array(Q);d(ka);var la=new Array(T);d(la);var ma,na,oa,pa=!1;c._tr_init=B,c._tr_stored_block=C,c._tr_flush_block=E,c._tr_tally=F,c._tr_align=D},{"../utils/common":62}],74:[function(a,b,c){"use strict";function d(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}b.exports=d},{}]},{},[10])(10)});
/*
FileSaver.js
The MIT License
Copyright (c) 2016 [Eli Grey][1].
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
[1]: http://eligrey.com
*/
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}});f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});
// WHAT: Concatenated JavaScript source files
// PROGRAM: Retro n-gon renderer
// VERSION: beta live (13 January 2021 19:09:54 UTC)
// AUTHOR: Tarpeeksi Hyvae Soft and others
// LINK: https://www.github.com/leikareipa/retro-ngon/
// FILES:
//	./js/retro-ngon/retro-ngon.js
//	./js/retro-ngon/trig.js
//	./js/retro-ngon/light.js
//	./js/retro-ngon/color.js
//	./js/retro-ngon/vector3.js
//	./js/retro-ngon/vertex.js
//	./js/retro-ngon/mesh.js
//	./js/retro-ngon/ngon.js
//	./js/retro-ngon/line-draw.js
//	./js/retro-ngon/matrix44.js
//	./js/retro-ngon/ngon-fill.js
//	./js/retro-ngon/transform-and-light.js
//	./js/retro-ngon/render.js
//	./js/retro-ngon/render-async.js
//	./js/retro-ngon/render-shared.js
//	./js/retro-ngon/texture.js
//	./js/retro-ngon/surface.js
/////////////////////////////////////////////////
/*
* Tarpeeksi Hyvae Soft 2019 /
* Retro n-gon renderer
*
*/
"use strict";
// Top-level namespace for the retro n-gon renderer.
const Rngon = {
version: {family:"beta",major:"5",minor:"0",dev:true}
};
// Various small utility functions and the like.
{
// Defined 'true' to allow for the conveniency of named in-place assertions,
// e.g. Rngon.assert && (x === 1) || Rngon.throw("X wasn't 1.").
// Note that setting this to 'false' won't disable assertions - for that,
// you'll want to search/replace "Rngon.assert &&" with "Rngon.assert ||"
// and keep this set to 'true'. The comparison against Rngon.assert may still
// be done, though (I guess depending on the JS engine's ability to optimize).
Object.defineProperty(Rngon, "assert", {value:true, writable:false});
Rngon.lerp = (x, y, interval)=>(x + (interval * (y - x)));
// Returns a bilinearly sampled value from a one-channel 2D image (or other
// such array of data). Expects the 'sampler' argument to be a function of
// the form (a, b)=>image[(x + a) + (y + b) * width], i.e. a function that
// returns the relevant image source value at XY, offset respectively by the
// two arguments to the function (the absolute XY coordinates are baked into
// the sampler function's body).
Rngon.bilinear_sample = (sampler, biasX = 0.5, biasY = biasX)=>
{
const px1 = Rngon.lerp(sampler(0, 0), sampler(0, 1), biasY);
const px2 = Rngon.lerp(sampler(1, 0), sampler(1, 1), biasY);
return Rngon.lerp(px1, px2, biasX);
};
Rngon.throw = (errMessage = "")=>
{
if (Rngon.internalState.allowWindowAlert)
{
window.alert("Retro n-gon error: " + errMessage);
}
throw Error("Retro n-gon error: " + errMessage);
}
Rngon.log = (string = "Hello there.")=>
{
console.log("Retro n-gon: " + string);
}
// Returns the resulting width of an image if it were rendered onto the given canvas element.
// The 'scale' parameter corresponds to the 'scale' option of Rngon.render().
Rngon.renderable_width_of = function(canvasElement, scale)
{
return Math.floor(parseInt(window.getComputedStyle(canvasElement).getPropertyValue("width")) * scale);
}
// Returns the resulting height of an image if it were rendered onto the given canvas element.
// The 'scale' parameter corresponds to the 'scale' option of Rngon.render().
Rngon.renderable_height_of = function(canvasElement, scale)
{
return Math.floor(parseInt(window.getComputedStyle(canvasElement).getPropertyValue("height")) * scale);
}
}
// Global app state, for internal use by the renderer. Unless otherwise noted, these
// parameters should not be modified directly; they're instead set by the renderer
// based on settings requested by the user.
Rngon.internalState =
{
// Modules provide core renderer functionality in overridable packages (the
// user can provide custom modules to be used in place of the default ones).
// Each module is a function that performs a set of tasks.
modules: {
// Transforms the given n-gons into screen space, placing the transformed
// n-gons into the internal n-gon cache. Also applies lighting and viewport
// clipping.
transform_clip_light: undefined,
// Rasterizes the n-gons in the internal n-gon cache onto the current
// render surface.
ngon_fill: undefined,
// Removes all rendered pixels from the render surface.
surface_wipe: undefined,
},
// Whether to require pixels to pass a depth test before being allowed on screen.
useDepthBuffer: false,
depthBuffer: {width:1, height:1, data:new Array(1), clearValue:Infinity},
// Pixel buffer for rasterization. This will be scaled to match the requested
// render resolution; and the renderer's rasterization pass will populate it
// with the rendered frame's pixel values.
pixelBuffer: new ImageData(1, 1),
// For each pixel in the rendered frame, metadata about the state of the renderer
// at that pixel, intended to be used by shaders. The array's size will be set to
// match the requested render resolution.
fragmentBuffer: {width:1, height:1, data:new Array(1), clearValue:{
// Index to an n-gon in the list of transformed n-gons that this pixel is
// part of.
ngonIdx: undefined,
// Texture coordinates at this pixel, scaled to the dimensions of the
// n-gon's texture and with any clamping/repetition applied. In other
// words, these are the exact texture coordinates from which the pixel's
// texel was obtained.
textureUScaled: undefined,
textureVScaled: undefined,
// Which of the texture's mip levels was used. This is a value from 0
// to n-1, where n is the total number of mip levels available in the
// texture.
textureMipLevelIdx: undefined,
// World coordinates at this pixel.
worldX: undefined,
worldY: undefined,
worldZ: undefined,
// The value written into the depth buffer by this fragment.
depth: undefined,
// The light level (0..1) at this pixel as computed by the renderer's
// built-in lighting engine.
shade: undefined,
w: undefined,
}
},
// If true, enables the fragment buffer and allows the use of pixel shaders. Note
// that enabling shaders carries a performance penalty even if you don't actually
// make use of any pixel shaders.
usePixelShader: false,
useVertexShader: false,
usePerspectiveCorrectInterpolation: false,
// If set to true, all n-gons will be rendered with a wireframe.
showGlobalWireframe: false,
// If true, all n-gons will be clipped against the viewport.
applyViewportClipping: true,
// Distance, in world units, to the far clipping plane.
farPlaneDistance: 1,
// Whether the renderer is allowed to call window.alert(), e.g. to alert the user
// to errors. This parameter can be set directly, as the render API doesn't yet
// expose a way to toggle it otherwise.
allowWindowAlert: false,
// All of the n-gons that were most recently passed to render(), transformed into
// screen space.
ngonCache: {count:0, ngons:[]},
// All light sources that should currently apply to n-gons passed to render().
lights: [],
}
/*
* Tarpeeksi Hyvae Soft 2019 /
* Retro n-gon renderer
*
*/
"use strict";
// Trigonometric lookup tables, and helper functions for accessing them.
Rngon.trig = (function()
{
const publicInterface = Object.freeze(
{
// Returns approximations of sin() and cos() for degrees 0..359 given in
// the range 0..65535. For instance, to get sin() for 144 deg, you'd call
// sin(deg(144)), or alternatively sin(26214).
// NOTE: Doesn't validate the input, so make sure it's in the correct range
//       before calling these functions.
sin: (x)=>sineLut[x>>6],
cos: (x)=>sineLut[(x>>6)+256],
// Transforms the given value 0..359 to the range 0..65535, which can, for
// instance, be fed into the sin() and cos() helper functions, above.
// Will wrap the input value to the correct range.
// The magic number 182.04166666666666 is 65535/360.
deg: (deg)=>(182.04166666666666 * (deg >= 0? (deg % 360) : (360 - (Math.abs(deg) % 360)))),
});
// Range: 0-1023 for sin() + 256 for approximating cos().
const sineLut =
[0.0000000,
0.0061359, 0.0122715, 0.0184067, 0.0245412, 0.0306748, 0.0368072, 0.0429383, 0.0490677,
0.0551952, 0.0613207, 0.0674439, 0.0735646, 0.0796824, 0.0857973, 0.0919090, 0.0980171,
0.1041216, 0.1102222, 0.1163186, 0.1224107, 0.1284981, 0.1345807, 0.1406582, 0.1467305,
0.1527972, 0.1588581, 0.1649131, 0.1709619, 0.1770042, 0.1830399, 0.1890687, 0.1950903,
0.2011046, 0.2071114, 0.2131103, 0.2191012, 0.2250839, 0.2310581, 0.2370236, 0.2429802,
0.2489276, 0.2548657, 0.2607941, 0.2667128, 0.2726214, 0.2785197, 0.2844075, 0.2902847,
0.2961509, 0.3020059, 0.3078496, 0.3136817, 0.3195020, 0.3253103, 0.3311063, 0.3368899,
0.3426607, 0.3484187, 0.3541635, 0.3598950, 0.3656130, 0.3713172, 0.3770074, 0.3826834,
0.3883450, 0.3939920, 0.3996242, 0.4052413, 0.4108432, 0.4164296, 0.4220003, 0.4275551,
0.4330938, 0.4386162, 0.4441221, 0.4496113, 0.4550836, 0.4605387, 0.4659765, 0.4713967,
0.4767992, 0.4821838, 0.4875502, 0.4928982, 0.4982277, 0.5035384, 0.5088301, 0.5141027,
0.5193560, 0.5245897, 0.5298036, 0.5349976, 0.5401715, 0.5453250, 0.5504580, 0.5555702,
0.5606616, 0.5657318, 0.5707807, 0.5758082, 0.5808140, 0.5857979, 0.5907597, 0.5956993,
0.6006165, 0.6055110, 0.6103828, 0.6152316, 0.6200572, 0.6248595, 0.6296382, 0.6343933,
0.6391244, 0.6438315, 0.6485144, 0.6531728, 0.6578067, 0.6624158, 0.6669999, 0.6715590,
0.6760927, 0.6806010, 0.6850837, 0.6895405, 0.6939715, 0.6983762, 0.7027547, 0.7071068,
0.7114322, 0.7157308, 0.7200025, 0.7242471, 0.7284644, 0.7326543, 0.7368166, 0.7409511,
0.7450578, 0.7491364, 0.7531868, 0.7572088, 0.7612024, 0.7651673, 0.7691033, 0.7730105,
0.7768885, 0.7807372, 0.7845566, 0.7883464, 0.7921066, 0.7958369, 0.7995373, 0.8032075,
0.8068476, 0.8104572, 0.8140363, 0.8175848, 0.8211025, 0.8245893, 0.8280450, 0.8314696,
0.8348629, 0.8382247, 0.8415550, 0.8448536, 0.8481203, 0.8513552, 0.8545580, 0.8577286,
0.8608669, 0.8639729, 0.8670462, 0.8700870, 0.8730950, 0.8760701, 0.8790122, 0.8819213,
0.8847971, 0.8876396, 0.8904487, 0.8932243, 0.8959662, 0.8986745, 0.9013488, 0.9039893,
0.9065957, 0.9091680, 0.9117060, 0.9142098, 0.9166791, 0.9191139, 0.9215140, 0.9238795,
0.9262102, 0.9285061, 0.9307670, 0.9329928, 0.9351835, 0.9373390, 0.9394592, 0.9415441,
0.9435935, 0.9456073, 0.9475856, 0.9495282, 0.9514350, 0.9533060, 0.9551412, 0.9569403,
0.9587035, 0.9604305, 0.9621214, 0.9637761, 0.9653944, 0.9669765, 0.9685221, 0.9700313,
0.9715039, 0.9729400, 0.9743394, 0.9757021, 0.9770281, 0.9783174, 0.9795698, 0.9807853,
0.9819639, 0.9831055, 0.9842101, 0.9852776, 0.9863081, 0.9873014, 0.9882576, 0.9891765,
0.9900582, 0.9909026, 0.9917098, 0.9924795, 0.9932119, 0.9939070, 0.9945646, 0.9951847,
0.9957674, 0.9963126, 0.9968203, 0.9972905, 0.9977231, 0.9981181, 0.9984756, 0.9987955,
0.9990777, 0.9993224, 0.9995294, 0.9996988, 0.9998306, 0.9999247, 0.9999812, 1.0000000,
0.9999812, 0.9999247, 0.9998306, 0.9996988, 0.9995294, 0.9993224, 0.9990777, 0.9987955,
0.9984756, 0.9981181, 0.9977231, 0.9972905, 0.9968203, 0.9963126, 0.9957674, 0.9951847,
0.9945646, 0.9939070, 0.9932119, 0.9924795, 0.9917098, 0.9909026, 0.9900582, 0.9891765,
0.9882576, 0.9873014, 0.9863081, 0.9852776, 0.9842101, 0.9831055, 0.9819639, 0.9807853,
0.9795698, 0.9783174, 0.9770281, 0.9757021, 0.9743394, 0.9729400, 0.9715039, 0.9700313,
0.9685221, 0.9669765, 0.9653944, 0.9637761, 0.9621214, 0.9604305, 0.9587035, 0.9569403,
0.9551412, 0.9533060, 0.9514350, 0.9495282, 0.9475856, 0.9456073, 0.9435935, 0.9415441,
0.9394592, 0.9373390, 0.9351835, 0.9329928, 0.9307670, 0.9285061, 0.9262102, 0.9238795,
0.9215140, 0.9191139, 0.9166791, 0.9142098, 0.9117060, 0.9091680, 0.9065957, 0.9039893,
0.9013488, 0.8986745, 0.8959662, 0.8932243, 0.8904487, 0.8876396, 0.8847971, 0.8819213,
0.8790122, 0.8760701, 0.8730950, 0.8700870, 0.8670462, 0.8639729, 0.8608669, 0.8577286,
0.8545580, 0.8513552, 0.8481203, 0.8448536, 0.8415550, 0.8382247, 0.8348629, 0.8314696,
0.8280450, 0.8245893, 0.8211025, 0.8175848, 0.8140363, 0.8104572, 0.8068476, 0.8032075,
0.7995373, 0.7958369, 0.7921066, 0.7883464, 0.7845566, 0.7807372, 0.7768885, 0.7730105,
0.7691033, 0.7651673, 0.7612024, 0.7572088, 0.7531868, 0.7491364, 0.7450578, 0.7409511,
0.7368166, 0.7326543, 0.7284644, 0.7242471, 0.7200025, 0.7157308, 0.7114322, 0.7071068,
0.7027547, 0.6983762, 0.6939715, 0.6895405, 0.6850837, 0.6806010, 0.6760927, 0.6715590,
0.6669999, 0.6624158, 0.6578067, 0.6531728, 0.6485144, 0.6438315, 0.6391244, 0.6343933,
0.6296382, 0.6248595, 0.6200572, 0.6152316, 0.6103828, 0.6055110, 0.6006165, 0.5956993,
0.5907597, 0.5857979, 0.5808140, 0.5758082, 0.5707807, 0.5657318, 0.5606616, 0.5555702,
0.5504580, 0.5453250, 0.5401715, 0.5349976, 0.5298036, 0.5245897, 0.5193560, 0.5141027,
0.5088301, 0.5035384, 0.4982277, 0.4928982, 0.4875502, 0.4821838, 0.4767992, 0.4713967,
0.4659765, 0.4605387, 0.4550836, 0.4496113, 0.4441221, 0.4386162, 0.4330938, 0.4275551,
0.4220003, 0.4164296, 0.4108432, 0.4052413, 0.3996242, 0.3939920, 0.3883450, 0.3826834,
0.3770074, 0.3713172, 0.3656130, 0.3598950, 0.3541635, 0.3484187, 0.3426607, 0.3368899,
0.3311063, 0.3253103, 0.3195020, 0.3136817, 0.3078496, 0.3020059, 0.2961509, 0.2902847,
0.2844075, 0.2785197, 0.2726214, 0.2667128, 0.2607941, 0.2548657, 0.2489276, 0.2429802,
0.2370236, 0.2310581, 0.2250839, 0.2191012, 0.2131103, 0.2071114, 0.2011046, 0.1950903,
0.1890687, 0.1830399, 0.1770042, 0.1709619, 0.1649131, 0.1588581, 0.1527972, 0.1467305,
0.1406582, 0.1345807, 0.1284981, 0.1224107, 0.1163186, 0.1102222, 0.1041216, 0.0980171,
0.0919090, 0.0857973, 0.0796824, 0.0735646, 0.0674439, 0.0613207, 0.0551952, 0.0490677,
0.0429383, 0.0368072, 0.0306748, 0.0245412, 0.0184067, 0.0122715, 0.0061359, 0.0000000,
-0.0061359, -0.0122715, -0.0184067, -0.0245412, -0.0306748, -0.0368072, -0.0429383, -0.0490677,
-0.0551952, -0.0613207, -0.0674439, -0.0735646, -0.0796824, -0.0857973, -0.0919090, -0.0980171,
-0.1041216, -0.1102222, -0.1163186, -0.1224107, -0.1284981, -0.1345807, -0.1406582, -0.1467305,
-0.1527972, -0.1588581, -0.1649131, -0.1709619, -0.1770042, -0.1830399, -0.1890687, -0.1950903,
-0.2011046, -0.2071114, -0.2131103, -0.2191012, -0.2250839, -0.2310581, -0.2370236, -0.2429802,
-0.2489276, -0.2548657, -0.2607941, -0.2667128, -0.2726214, -0.2785197, -0.2844075, -0.2902847,
-0.2961509, -0.3020059, -0.3078496, -0.3136817, -0.3195020, -0.3253103, -0.3311063, -0.3368899,
-0.3426607, -0.3484187, -0.3541635, -0.3598950, -0.3656130, -0.3713172, -0.3770074, -0.3826834,
-0.3883450, -0.3939920, -0.3996242, -0.4052413, -0.4108432, -0.4164296, -0.4220003, -0.4275551,
-0.4330938, -0.4386162, -0.4441221, -0.4496113, -0.4550836, -0.4605387, -0.4659765, -0.4713967,
-0.4767992, -0.4821838, -0.4875502, -0.4928982, -0.4982277, -0.5035384, -0.5088301, -0.5141027,
-0.5193560, -0.5245897, -0.5298036, -0.5349976, -0.5401715, -0.5453250, -0.5504580, -0.5555702,
-0.5606616, -0.5657318, -0.5707807, -0.5758082, -0.5808140, -0.5857979, -0.5907597, -0.5956993,
-0.6006165, -0.6055110, -0.6103828, -0.6152316, -0.6200572, -0.6248595, -0.6296382, -0.6343933,
-0.6391244, -0.6438315, -0.6485144, -0.6531728, -0.6578067, -0.6624158, -0.6669999, -0.6715590,
-0.6760927, -0.6806010, -0.6850837, -0.6895405, -0.6939715, -0.6983762, -0.7027547, -0.7071068,
-0.7114322, -0.7157308, -0.7200025, -0.7242471, -0.7284644, -0.7326543, -0.7368166, -0.7409511,
-0.7450578, -0.7491364, -0.7531868, -0.7572088, -0.7612024, -0.7651673, -0.7691033, -0.7730105,
-0.7768885, -0.7807372, -0.7845566, -0.7883464, -0.7921066, -0.7958369, -0.7995373, -0.8032075,
-0.8068476, -0.8104572, -0.8140363, -0.8175848, -0.8211025, -0.8245893, -0.8280450, -0.8314696,
-0.8348629, -0.8382247, -0.8415550, -0.8448536, -0.8481203, -0.8513552, -0.8545580, -0.8577286,
-0.8608669, -0.8639729, -0.8670462, -0.8700870, -0.8730950, -0.8760701, -0.8790122, -0.8819213,
-0.8847971, -0.8876396, -0.8904487, -0.8932243, -0.8959662, -0.8986745, -0.9013488, -0.9039893,
-0.9065957, -0.9091680, -0.9117060, -0.9142098, -0.9166791, -0.9191139, -0.9215140, -0.9238795,
-0.9262102, -0.9285061, -0.9307670, -0.9329928, -0.9351835, -0.9373390, -0.9394592, -0.9415441,
-0.9435935, -0.9456073, -0.9475856, -0.9495282, -0.9514350, -0.9533060, -0.9551412, -0.9569403,
-0.9587035, -0.9604305, -0.9621214, -0.9637761, -0.9653944, -0.9669765, -0.9685221, -0.9700313,
-0.9715039, -0.9729400, -0.9743394, -0.9757021, -0.9770281, -0.9783174, -0.9795698, -0.9807853,
-0.9819639, -0.9831055, -0.9842101, -0.9852776, -0.9863081, -0.9873014, -0.9882576, -0.9891765,
-0.9900582, -0.9909026, -0.9917098, -0.9924795, -0.9932119, -0.9939070, -0.9945646, -0.9951847,
-0.9957674, -0.9963126, -0.9968203, -0.9972905, -0.9977231, -0.9981181, -0.9984756, -0.9987955,
-0.9990777, -0.9993224, -0.9995294, -0.9996988, -0.9998306, -0.9999247, -0.9999812, -1.0000000,
-0.9999812, -0.9999247, -0.9998306, -0.9996988, -0.9995294, -0.9993224, -0.9990777, -0.9987955,
-0.9984756, -0.9981181, -0.9977231, -0.9972905, -0.9968203, -0.9963126, -0.9957674, -0.9951847,
-0.9945646, -0.9939070, -0.9932119, -0.9924795, -0.9917098, -0.9909026, -0.9900582, -0.9891765,
-0.9882576, -0.9873014, -0.9863081, -0.9852776, -0.9842101, -0.9831055, -0.9819639, -0.9807853,
-0.9795698, -0.9783174, -0.9770281, -0.9757021, -0.9743394, -0.9729400, -0.9715039, -0.9700313,
-0.9685221, -0.9669765, -0.9653944, -0.9637761, -0.9621214, -0.9604305, -0.9587035, -0.9569403,
-0.9551412, -0.9533060, -0.9514350, -0.9495282, -0.9475856, -0.9456073, -0.9435935, -0.9415441,
-0.9394592, -0.9373390, -0.9351835, -0.9329928, -0.9307670, -0.9285061, -0.9262102, -0.9238795,
-0.9215140, -0.9191139, -0.9166791, -0.9142098, -0.9117060, -0.9091680, -0.9065957, -0.9039893,
-0.9013488, -0.8986745, -0.8959662, -0.8932243, -0.8904487, -0.8876396, -0.8847971, -0.8819213,
-0.8790122, -0.8760701, -0.8730950, -0.8700870, -0.8670462, -0.8639729, -0.8608669, -0.8577286,
-0.8545580, -0.8513552, -0.8481203, -0.8448536, -0.8415550, -0.8382247, -0.8348629, -0.8314696,
-0.8280450, -0.8245893, -0.8211025, -0.8175848, -0.8140363, -0.8104572, -0.8068476, -0.8032075,
-0.7995373, -0.7958369, -0.7921066, -0.7883464, -0.7845566, -0.7807372, -0.7768885, -0.7730105,
-0.7691033, -0.7651673, -0.7612024, -0.7572088, -0.7531868, -0.7491364, -0.7450578, -0.7409511,
-0.7368166, -0.7326543, -0.7284644, -0.7242471, -0.7200025, -0.7157308, -0.7114322, -0.7071068,
-0.7027547, -0.6983762, -0.6939715, -0.6895405, -0.6850837, -0.6806010, -0.6760927, -0.6715590,
-0.6669999, -0.6624158, -0.6578067, -0.6531728, -0.6485144, -0.6438315, -0.6391244, -0.6343933,
-0.6296382, -0.6248595, -0.6200572, -0.6152316, -0.6103828, -0.6055110, -0.6006165, -0.5956993,
-0.5907597, -0.5857979, -0.5808140, -0.5758082, -0.5707807, -0.5657318, -0.5606616, -0.5555702,
-0.5504580, -0.5453250, -0.5401715, -0.5349976, -0.5298036, -0.5245897, -0.5193560, -0.5141027,
-0.5088301, -0.5035384, -0.4982277, -0.4928982, -0.4875502, -0.4821838, -0.4767992, -0.4713967,
-0.4659765, -0.4605387, -0.4550836, -0.4496113, -0.4441221, -0.4386162, -0.4330938, -0.4275551,
-0.4220003, -0.4164296, -0.4108432, -0.4052413, -0.3996242, -0.3939920, -0.3883450, -0.3826834,
-0.3770074, -0.3713172, -0.3656130, -0.3598950, -0.3541635, -0.3484187, -0.3426607, -0.3368899,
-0.3311063, -0.3253103, -0.3195020, -0.3136817, -0.3078496, -0.3020059, -0.2961509, -0.2902847,
-0.2844075, -0.2785197, -0.2726214, -0.2667128, -0.2607941, -0.2548657, -0.2489276, -0.2429802,
-0.2370236, -0.2310581, -0.2250839, -0.2191012, -0.2131103, -0.2071114, -0.2011046, -0.1950903,
-0.1890687, -0.1830399, -0.1770042, -0.1709619, -0.1649131, -0.1588581, -0.1527972, -0.1467305,
-0.1406582, -0.1345807, -0.1284981, -0.1224107, -0.1163186, -0.1102222, -0.1041216, -0.0980171,
-0.0919090, -0.0857973, -0.0796824, -0.0735646, -0.0674439, -0.0613207, -0.0551952, -0.0490677,
-0.0429383, -0.0368072, -0.0306748, -0.0245412, -0.0184067, -0.0122715, -0.0061359, -0.0000000,
0.0061359, 0.0122715, 0.0184067, 0.0245412, 0.0306748, 0.0368072, 0.0429383, 0.0490677,
0.0551952, 0.0613207, 0.0674439, 0.0735646, 0.0796824, 0.0857973, 0.0919090, 0.0980171,
0.1041216, 0.1102222, 0.1163186, 0.1224107, 0.1284981, 0.1345807, 0.1406582, 0.1467305,
0.1527972, 0.1588581, 0.1649131, 0.1709619, 0.1770042, 0.1830399, 0.1890687, 0.1950903,
0.2011046, 0.2071114, 0.2131103, 0.2191012, 0.2250839, 0.2310581, 0.2370236, 0.2429802,
0.2489276, 0.2548657, 0.2607941, 0.2667128, 0.2726214, 0.2785197, 0.2844075, 0.2902847,
0.2961509, 0.3020059, 0.3078496, 0.3136817, 0.3195020, 0.3253103, 0.3311063, 0.3368899,
0.3426607, 0.3484187, 0.3541635, 0.3598950, 0.3656130, 0.3713172, 0.3770074, 0.3826834,
0.3883450, 0.3939920, 0.3996242, 0.4052413, 0.4108432, 0.4164296, 0.4220003, 0.4275551,
0.4330938, 0.4386162, 0.4441221, 0.4496113, 0.4550836, 0.4605387, 0.4659765, 0.4713967,
0.4767992, 0.4821838, 0.4875502, 0.4928982, 0.4982277, 0.5035384, 0.5088301, 0.5141027,
0.5193560, 0.5245897, 0.5298036, 0.5349976, 0.5401715, 0.5453250, 0.5504580, 0.5555702,
0.5606616, 0.5657318, 0.5707807, 0.5758082, 0.5808140, 0.5857979, 0.5907597, 0.5956993,
0.6006165, 0.6055110, 0.6103828, 0.6152316, 0.6200572, 0.6248595, 0.6296382, 0.6343933,
0.6391244, 0.6438315, 0.6485144, 0.6531728, 0.6578067, 0.6624158, 0.6669999, 0.6715590,
0.6760927, 0.6806010, 0.6850837, 0.6895405, 0.6939715, 0.6983762, 0.7027547, 0.7071068,
0.7114322, 0.7157308, 0.7200025, 0.7242471, 0.7284644, 0.7326543, 0.7368166, 0.7409511,
0.7450578, 0.7491364, 0.7531868, 0.7572088, 0.7612024, 0.7651673, 0.7691033, 0.7730105,
0.7768885, 0.7807372, 0.7845566, 0.7883464, 0.7921066, 0.7958369, 0.7995373, 0.8032075,
0.8068476, 0.8104572, 0.8140363, 0.8175848, 0.8211025, 0.8245893, 0.8280450, 0.8314696,
0.8348629, 0.8382247, 0.8415550, 0.8448536, 0.8481203, 0.8513552, 0.8545580, 0.8577286,
0.8608669, 0.8639729, 0.8670462, 0.8700870, 0.8730950, 0.8760701, 0.8790122, 0.8819213,
0.8847971, 0.8876396, 0.8904487, 0.8932243, 0.8959662, 0.8986745, 0.9013488, 0.9039893,
0.9065957, 0.9091680, 0.9117060, 0.9142098, 0.9166791, 0.9191139, 0.9215140, 0.9238795,
0.9262102, 0.9285061, 0.9307670, 0.9329928, 0.9351835, 0.9373390, 0.9394592, 0.9415441,
0.9435935, 0.9456073, 0.9475856, 0.9495282, 0.9514350, 0.9533060, 0.9551412, 0.9569403,
0.9587035, 0.9604305, 0.9621214, 0.9637761, 0.9653944, 0.9669765, 0.9685221, 0.9700313,
0.9715039, 0.9729400, 0.9743394, 0.9757021, 0.9770281, 0.9783174, 0.9795698, 0.9807853,
0.9819639, 0.9831055, 0.9842101, 0.9852776, 0.9863081, 0.9873014, 0.9882576, 0.9891765,
0.9900582, 0.9909026, 0.9917098, 0.9924795, 0.9932119, 0.9939070, 0.9945646, 0.9951847,
0.9957674, 0.9963126, 0.9968203, 0.9972905, 0.9977231, 0.9981181, 0.9984756, 0.9987955,
0.9990777, 0.9993224, 0.9995294, 0.9996988, 0.9998306, 0.9999247, 0.9999812];
return publicInterface;
})();
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: Retro n-gon renderer
*
*/
"use strict";
// A light source.
Rngon.light = function(position = Rngon.translation_vector(0, 0, 0),
settings = {})
{
Rngon.assert && (typeof position === "object")
|| Rngon.throw("Expected numbers as parameters to the light factory.");
settings = {
...Rngon.light.defaultSettings,
...settings,
};
const returnObject =
{
position,
...settings,
};
return returnObject;
}
Rngon.light.defaultSettings = {
intensity: 100,
// The maximum shade value that this light can generate. A value of 1 means
// that a surface fully lit by this light displays its base color (or base
// texel) and never a color brighter than that. A value higher than one will
// boost the base color of a fully lit surface by that multiple.
clip: 1,
// How strongly the light's intensity attenuates with distance from the light
// source. Values lower than 1 cause the light to attenuate less over a distance;
// while values above 1 cause the light to attenuate more over a distance.
attenuation: 1,
}
/*
* Tarpeeksi Hyvae Soft 2019 /
* Retro n-gon renderer
*
*/
"use strict";
// Red, green, blue, alpha; in the range 0..255.
// NOTE: Expects to remain immutable.
Rngon.color_rgba = function(red = 55, green = 55, blue = 55, alpha = 255)
{
Rngon.assert && (((red   >= 0) && (red   <= 255)) &&
((green >= 0) && (green <= 255)) &&
((blue  >= 0) && (blue  <= 255)) &&
((alpha >= 0) && (alpha <= 255)))
|| Rngon.throw("The given color values are out of range.");
// Alternate range, 0..1.
const unitRange = Object.freeze({red:red/255, green:green/255, blue:blue/255, alpha:alpha/255});
const publicInterface = Object.freeze(
{
red,
green,
blue,
alpha,
unitRange,
});
return publicInterface;
}
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Retro n-gon renderer
*
*/
"use strict";
// NOTE: The returned object is not immutable.
Rngon.vector3 = function(x = 0, y = 0, z = 0)
{
Rngon.assert && (typeof x === "number" && typeof y === "number" && typeof z === "number")
|| Rngon.throw("Expected numbers as parameters to the vector3 factory.");
const returnObject =
{
x,
y,
z,
};
return returnObject;
}
// Convenience aliases for vector3.
Rngon.translation_vector = Rngon.vector3;
Rngon.rotation_vector    = (x, y, z)=>Rngon.vector3(Rngon.trig.deg(x), Rngon.trig.deg(y), Rngon.trig.deg(z));
Rngon.scaling_vector     = Rngon.vector3;
// Transforms the vector by the given 4x4 matrix.
Rngon.vector3.transform = function(v, m = [])
{
Rngon.assert && (m.length === 16)
|| Rngon.throw("Expected a 4 x 4 matrix to transform the vector by.");
const x_ = ((m[0] * v.x) + (m[4] * v.y) + (m[ 8] * v.z));
const y_ = ((m[1] * v.x) + (m[5] * v.y) + (m[ 9] * v.z));
const z_ = ((m[2] * v.x) + (m[6] * v.y) + (m[10] * v.z));
v.x = x_;
v.y = y_;
v.z = z_;
}
Rngon.vector3.normalize = function(v)
{
const sn = ((v.x * v.x) + (v.y * v.y) + (v.z * v.z));
if (sn != 0 && sn != 1)
{
const inv = (1 / Math.sqrt(sn));
v.x *= inv;
v.y *= inv;
v.z *= inv;
}
}
Rngon.vector3.dot = function(v, other)
{
return ((v.x * other.x) + (v.y * other.y) + (v.z * other.z));
}
Rngon.vector3.cross = function(v, other)
{
const c = Rngon.vector3();
c.x = ((v.y * other.z) - (v.z * other.y));
c.y = ((v.z * other.x) - (v.x * other.z));
c.z = ((v.x * other.y) - (v.y * other.x));
return c;
}
Rngon.vector3.invert = function(v)
{
v.x *= -1;
v.y *= -1;
v.z *= -1;
}
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Retro n-gon renderer
*
*/
"use strict";
// NOTE: The returned object is not immutable.
Rngon.vertex = function(x = 0, y = 0, z = 0,
u = 0, v = 0,
w = 1,
shade = 1,
worldX = x, worldY = y, worldZ = z)
{
Rngon.assert && (typeof x === "number" && typeof y === "number" && typeof z === "number" &&
typeof w === "number" && typeof u === "number" && typeof v === "number" &&
typeof worldX === "number" && typeof worldY === "number" && typeof worldZ === "number")
|| Rngon.throw("Expected numbers as parameters to the vertex factory.");
const returnObject =
{
x,
y,
z,
u,
v,
w,
// A value in the range >= 0 that defines how lit this vertex is. A value of
// 1 corresponds to fully lit, 0 to fully unlit.
shade,
// The vertex's original coordinates, before any transformations.
worldX,
worldY,
worldZ,
};
return returnObject;
}
// Transforms the vertex by the given 4x4 matrix.
Rngon.vertex.transform = function(v, m = [])
{
Rngon.assert && (m.length === 16)
|| Rngon.throw("Expected a 4 x 4 matrix to transform the vertex by.");
const x_ = ((m[0] * v.x) + (m[4] * v.y) + (m[ 8] * v.z) + (m[12] * v.w));
const y_ = ((m[1] * v.x) + (m[5] * v.y) + (m[ 9] * v.z) + (m[13] * v.w));
const z_ = ((m[2] * v.x) + (m[6] * v.y) + (m[10] * v.z) + (m[14] * v.w));
const w_ = ((m[3] * v.x) + (m[7] * v.y) + (m[11] * v.z) + (m[15] * v.w));
v.x = x_;
v.y = y_;
v.z = z_;
v.w = w_;
}
// Applies perspective division to the vertex.
Rngon.vertex.perspective_divide = function(v)
{
v.x /= v.w;
v.y /= v.w;
}
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Retro n-gon renderer
*
*/
"use strict";
// A collection of ngons, with shared translation and rotation.
// NOTE: Expects to remain immutable.
Rngon.mesh = function(ngons = [Rngon.ngon()], transform = {})
{
Rngon.assert && (ngons instanceof Array) || Rngon.throw("Expected a list of ngons for creating an ngon mesh.");
Rngon.assert && (transform instanceof Object) || Rngon.throw("Expected an object with transformation properties.");
Rngon.assert && (typeof Rngon.mesh.defaultTransform.rotation !== "undefined" &&
typeof Rngon.mesh.defaultTransform.translation !== "undefined" &&
typeof Rngon.mesh.defaultTransform.scaling !== "undefined")
|| Rngon.throw("The default transforms object for mesh() is missing required properties.");
// Combine default transformations with the user-supplied ones.
transform =
{
...Rngon.mesh.defaultTransform,
...transform
};
const publicInterface =
{
ngons,
rotation: transform.rotation,
translation: transform.translation,
scale: transform.scaling,
};
return publicInterface;
}
Rngon.mesh.defaultTransform =
{
translation: Rngon.translation_vector(0, 0, 0),
rotation: Rngon.rotation_vector(0, 0, 0),
scaling: Rngon.scaling_vector(1, 1, 1)
};
Rngon.mesh.object_space_matrix = function(m)
{
const translationMatrix = Rngon.matrix44.translation(m.translation.x,
m.translation.y,
m.translation.z);
const rotationMatrix = Rngon.matrix44.rotation(m.rotation.x,
m.rotation.y,
m.rotation.z);
const scalingMatrix = Rngon.matrix44.scaling(m.scale.x,
m.scale.y,
m.scale.z);
return Rngon.matrix44.multiply(Rngon.matrix44.multiply(translationMatrix, rotationMatrix), scalingMatrix);
}
/*
* 2019 Tarpeeksi Hyvae Soft
*
* Software: Retro n-gon renderer
*
*/
"use strict";
// A single n-sided ngon.
// NOTE: The return object is not immutable.
Rngon.ngon = function(vertices = [Rngon.vertex()], material = {}, vertexNormals = Rngon.vector3(0, 1, 0))
{
Rngon.assert && (vertices instanceof Array) || Rngon.throw("Expected an array of vertices to make an ngon.");
Rngon.assert && (material instanceof Object) || Rngon.throw("Expected an object containing user-supplied options.");
Rngon.assert && (typeof Rngon.ngon.defaultMaterial.color !== "undefined" &&
typeof Rngon.ngon.defaultMaterial.texture !== "undefined" &&
typeof Rngon.ngon.defaultMaterial.hasWireframe !== "undefined" &&
typeof Rngon.ngon.defaultMaterial.wireframeColor !== "undefined")
|| Rngon.throw("The default material object for ngon() is missing required properties.");
// Assuming that only a single normal vector was provided, in which case, let's
// duplicate that normal for all vertices.
if (!Array.isArray(vertexNormals))
{
vertexNormals = new Array(vertices.length).fill().map(n=>Rngon.vector3(vertexNormals.x, vertexNormals.y, vertexNormals.z));
}
const faceNormal = vertexNormals.reduce((faceNormal, vertexNormal)=>
{
faceNormal.x += vertexNormal.x;
faceNormal.y += vertexNormal.y;
faceNormal.z += vertexNormal.z;
return faceNormal;
}, Rngon.vector3(0, 0, 0));
Rngon.vector3.normalize(faceNormal);
// Combine default material options with the user-supplied ones.
material =
{
...Rngon.ngon.defaultMaterial,
...material
};
// If we get vertex U or V coordinates in the range [0,-x], we want to change 0 to
// -eps to avoid incorrect rounding during texture-mapping.
{
const hasNegativeU = vertices.map(v=>v.u).some(u=>(u < 0));
const hasNegativeV = vertices.map(v=>v.v).some(v=>(v < 0));
if (hasNegativeU || hasNegativeV)
{
for (const vert of vertices)
{
if (hasNegativeU && vert.u === 0) vert.u = -Number.EPSILON;
if (hasNegativeV && vert.v === 0) vert.v = -Number.EPSILON;
}
}
}
const returnObject =
{
vertices,
vertexNormals,
normal: faceNormal,
material,
// A value in the range [0,1] that defines which mip level of this
// n-gon's texture (if it has a texture) should be used when rendering.
// A value of 0 is the maximum-resolution (base) mip level, 1 is the
// lowest-resolution (1 x 1) mip level.
mipLevel: 0,
};
return returnObject;
}
Rngon.ngon.defaultMaterial =
{
color: Rngon.color_rgba(255, 255, 255, 255),
texture: null,
textureMapping: "ortho",
uvWrapping: "repeat",
vertexShading: "none",
renderVertexShade: true,
ambientLightLevel: 0,
hasWireframe: false,
hasFill: true,
isTwoSided: true,
wireframeColor: Rngon.color_rgba(0, 0, 0),
allowTransform: true,
allowAlphaReject: true,
allowAlphaBlend: true,
auxiliary: {},
};
Rngon.ngon.perspective_divide = function(ngon)
{
for (const vert of ngon.vertices)
{
Rngon.vertex.perspective_divide(vert);
}
},
Rngon.ngon.transform = function(ngon, matrix44)
{
for (const vert of ngon.vertices)
{
Rngon.vertex.transform(vert, matrix44);
}
},
// Clips all vertices against the sides of the viewport. Adapted from Benny
// Bobaganoosh's 3d software renderer, the source for which is available at
// https://github.com/BennyQBD/3DSoftwareRenderer.
Rngon.ngon.clip_to_viewport = function(ngon)
{
clip_on_axis("x", 1);
clip_on_axis("x", -1);
clip_on_axis("y", 1);
clip_on_axis("y", -1);
clip_on_axis("z", 1);
clip_on_axis("z", -1);
return;
function clip_on_axis(axis, factor)
{
if (!ngon.vertices.length)
{
return;
}
if (ngon.vertices.length == 1)
{
// If the point is fully inside the viewport, allow it to stay.
if (( ngon.vertices[0].x <= ngon.vertices[0].w) &&
(-ngon.vertices[0].x <= ngon.vertices[0].w) &&
( ngon.vertices[0].y <= ngon.vertices[0].w) &&
(-ngon.vertices[0].y <= ngon.vertices[0].w) &&
( ngon.vertices[0].z <= ngon.vertices[0].w) &&
(-ngon.vertices[0].z <= ngon.vertices[0].w))
{
return;
}
ngon.vertices.length = 0;
return;
}
let prevVertex = ngon.vertices[ngon.vertices.length - ((ngon.vertices.length == 2)? 2 : 1)];
let prevComponent = (prevVertex[axis] * factor);
let isPrevVertexInside = (prevComponent <= prevVertex.w);
// The vertices array will be modified in-place by appending the clipped vertices
// onto the end of the array, then removing the previous ones.
let k = 0;
let numOriginalVertices = ngon.vertices.length;
for (let i = 0; i < numOriginalVertices; i++)
{
const curComponent = (ngon.vertices[i][axis] * factor);
const thisVertexIsInside = (curComponent <= ngon.vertices[i].w);
// If either the current vertex or the previous vertex is inside but the other isn't,
// and they aren't both inside, interpolate a new vertex between them that lies on
// the clipping plane.
if (thisVertexIsInside ^ isPrevVertexInside)
{
const lerpStep = (prevVertex.w - prevComponent) /
((prevVertex.w - prevComponent) - (ngon.vertices[i].w - curComponent));
if (Rngon.internalState.usePixelShader)
{
ngon.vertices[numOriginalVertices + k++] = Rngon.vertex(Rngon.lerp(prevVertex.x, ngon.vertices[i].x, lerpStep),
Rngon.lerp(prevVertex.y, ngon.vertices[i].y, lerpStep),
Rngon.lerp(prevVertex.z, ngon.vertices[i].z, lerpStep),
Rngon.lerp(prevVertex.u, ngon.vertices[i].u, lerpStep),
Rngon.lerp(prevVertex.v, ngon.vertices[i].v, lerpStep),
Rngon.lerp(prevVertex.w, ngon.vertices[i].w, lerpStep),
Rngon.lerp(prevVertex.shade, ngon.vertices[i].shade, lerpStep),
Rngon.lerp(prevVertex.worldX, ngon.vertices[i].worldX, lerpStep),
Rngon.lerp(prevVertex.worldY, ngon.vertices[i].worldY, lerpStep),
Rngon.lerp(prevVertex.worldZ, ngon.vertices[i].worldZ, lerpStep));
}
else
{
ngon.vertices[numOriginalVertices + k++] = Rngon.vertex(Rngon.lerp(prevVertex.x, ngon.vertices[i].x, lerpStep),
Rngon.lerp(prevVertex.y, ngon.vertices[i].y, lerpStep),
Rngon.lerp(prevVertex.z, ngon.vertices[i].z, lerpStep),
Rngon.lerp(prevVertex.u, ngon.vertices[i].u, lerpStep),
Rngon.lerp(prevVertex.v, ngon.vertices[i].v, lerpStep),
Rngon.lerp(prevVertex.w, ngon.vertices[i].w, lerpStep),
Rngon.lerp(prevVertex.shade, ngon.vertices[i].shade, lerpStep));
}
}
if (thisVertexIsInside)
{
ngon.vertices[numOriginalVertices + k++] = ngon.vertices[i];
}
prevVertex = ngon.vertices[i];
prevComponent = curComponent;
isPrevVertexInside = thisVertexIsInside;
}
ngon.vertices.splice(0, numOriginalVertices);
return;
}
}
"use strict";
// Draws a line between the two given vertices into the render's pixel buffer.
Rngon.line_draw = function(vert1 = Rngon.vertex(),
vert2 = Rngon.vertex(),
lineColor = null,
ngonIdx = 0,
ignoreDepthBuffer = false)
{
const pixelBuffer = Rngon.internalState.pixelBuffer.data;
const depthBuffer = (Rngon.internalState.useDepthBuffer? Rngon.internalState.depthBuffer.data : null);
const fragmentBuffer = (Rngon.internalState.usePixelShader? Rngon.internalState.fragmentBuffer.data : null);
const renderWidth = Rngon.internalState.pixelBuffer.width;
const renderHeight = Rngon.internalState.pixelBuffer.height;
const interpolatePerspective = Rngon.internalState.usePerspectiveCorrectInterpolation;
let x0 = Math.round(vert1.x);
let y0 = Math.round(vert1.y);
const x1 = Math.round(vert2.x);
const y1 = Math.round(vert2.y);
const lineLength = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
// Establish interpolation parameters.
const w1 = (interpolatePerspective? vert1.w : 1);
const w2 = (interpolatePerspective? vert2.w : 1);
const depth1 = (vert1.z / Rngon.internalState.farPlaneDistance);
const depth2 = (vert2.z / Rngon.internalState.farPlaneDistance);
let startDepth = depth1/w1;
const deltaDepth = ((depth2/w2 - depth1/w1) / lineLength);
let startShade = vert1.shade/w1;
const deltaShade = ((vert2.shade/w2 - vert1.shade/w1) / lineLength);
let startInvW = 1/w1;
const deltaInvW = ((1/w2 - 1/w1) / lineLength);
if (fragmentBuffer)
{
var startWorldX = vert1.worldX/w1;
var deltaWorldX = ((vert2.worldX/w2 - vert1.worldX/w1) / lineLength);
var startWorldY = vert1.worldY/w1;
var deltaWorldY = ((vert2.worldY/w2 - vert1.worldY/w1) / lineLength);
var startWorldZ = vert1.worldZ/w1;
var deltaWorldZ = ((vert2.worldZ/w2 - vert1.worldZ/w1) / lineLength);
}
// Bresenham line algo. Adapted from https://stackoverflow.com/a/4672319.
{
let dx = Math.abs(x1 - x0);
let dy = Math.abs(y1 - y0);
const sx = ((x0 < x1)? 1 : -1);
const sy = ((y0 < y1)? 1 : -1);
let err = (((dx > dy)? dx : -dy) / 2);
const maxNumSteps = (renderWidth + renderHeight);
let numSteps = 0;
while (++numSteps < maxNumSteps)
{
put_pixel(x0, y0);
if ((x0 === x1) && (y0 === y1))
{
break;
}
// Increment interpolated values.
{
startDepth += deltaDepth;
startShade += deltaShade;
startInvW += deltaInvW;
if (fragmentBuffer)
{
startWorldX += deltaWorldX;
startWorldY += deltaWorldY;
startWorldZ += deltaWorldZ;
}
}
const e2 = err;
if (e2 > -dx)
{
err -= dy;
x0 += sx;
}
if (e2 < dy)
{
err += dx;
y0 += sy;
}
}
function put_pixel(x, y)
{
const idx = ((x + y * renderWidth) * 4);
const depthBufferIdx = (idx / 4);
if ((x < 0) || (x >= renderWidth) ||
(y < 0) || (y >= renderHeight))
{
return;
}
const depth = (startDepth / startInvW);
const shade = (startShade / startInvW);
// Depth test.
if (!ignoreDepthBuffer && depthBuffer && (depthBuffer[depthBufferIdx] <= depth)) return;
// Alpha test.
if (lineColor.alpha !== 255) return;
// Draw the pixel.
{
pixelBuffer[idx + 0] = (shade * lineColor.red);
pixelBuffer[idx + 1] = (shade * lineColor.green);
pixelBuffer[idx + 2] = (shade * lineColor.blue);
pixelBuffer[idx + 3] = 255;
if (depthBuffer)
{
depthBuffer[depthBufferIdx] = depth;
}
if (fragmentBuffer)
{
const fragment = fragmentBuffer[depthBufferIdx];
fragment.ngonIdx = ngonIdx;
fragment.textureUScaled = undefined; // We don't support textures on lines.
fragment.textureVScaled = undefined;
fragment.depth = (startDepth / startInvW);
fragment.shade = (startShade / startInvW);
fragment.worldX = (startWorldX / startInvW);
fragment.worldY = (startWorldY / startInvW);
fragment.worldZ = (startWorldZ / startInvW);
fragment.w = (1 / startInvW);
}
}
return;
}
}
};
/*
* Tarpeeksi Hyvae Soft 2019 /
* Retro n-gon renderer
*
* 4-by-4 matrix manipulation.
*
* Adapted and modified from code written originally by Benny Bobaganoosh for his 3d software
* renderer (https://github.com/BennyQBD/3DSoftwareRenderer). Full attribution:
* {
*     Copyright (c) 2014, Benny Bobaganoosh
*     All rights reserved.
*
*     Redistribution and use in source and binary forms, with or without
*     modification, are permitted provided that the following conditions are met:
*
*     1. Redistributions of source code must retain the above copyright notice, this
*         list of conditions and the following disclaimer.
*     2. Redistributions in binary form must reproduce the above copyright notice,
*         this list of conditions and the following disclaimer in the documentation
*         and/or other materials provided with the distribution.
*
*     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
*     ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
*     WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
*     DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
*     ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
*     (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
*     LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
*     ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
*     (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
*     SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* }
*
*/
"use strict";
// Provides manipulation of 4-by-4 matrices.
Rngon.matrix44 = (()=>
{
return Object.freeze(
{
scaling: function(x = 0, y = 0, z = 0)
{
return Object.freeze([x, 0, 0, 0,
0, y, 0, 0,
0, 0, z, 0,
0, 0, 0, 1]);
},
translation: function(x = 0, y = 0, z = 0)
{
return Object.freeze([1, 0, 0, 0,
0, 1, 0, 0,
0, 0, 1, 0,
x, y, z, 1]);
},
rotation: function(x = 0, y = 0, z = 0)
{
const cos = Rngon.trig.cos;
const sin = Rngon.trig.sin;
const mx = [1,       0,       0,       0,
0,       cos(x),  -sin(x), 0,
0,       sin(x),  cos(x),  0,
0,       0,       0,       1];
const my = [cos(y),  0,       sin(y),  0,
0,       1,       0,       0,
-sin(y), 0,       cos(y),  0,
0,       0,       0,       1];
const mz = [cos(z),  -sin(z), 0,       0,
sin(z),  cos(z),  0,       0,
0,       0,       1,       0,
0,       0,       0,       1];
const temp = Rngon.matrix44.multiply(my, mz);
const mResult = Rngon.matrix44.multiply(mx, temp);
Rngon.assert && (mResult.length === 16) || Rngon.throw("Expected a 4 x 4 matrix.");
return Object.freeze(mResult);
},
perspective: function(fov = 0, aspectRatio = 0, zNear = 0, zFar = 0)
{
const fovHalf = Math.tan(fov / 2);
const zRange = (zNear - zFar);
return Object.freeze([(1 / (fovHalf * aspectRatio)), 0,             0,                             0,
0,                            (1 / fovHalf), 0,                             0,
0,                            0,             ((-zNear - zFar) / zRange),    1,
0,                            0,             (2 * zFar * (zNear / zRange)), 0]);
},
ortho: function(width = 0, height = 0)
{
return Object.freeze([(width/2),     0,              0, 0,
0,             -(height/2),    0, 0,
0,             0,              1, 0,
(width/2)-0.5, (height/2)-0.5, 0, 1]);
},
multiply: function(m1 = [], m2 = [])
{
Rngon.assert && ((m1.length === 16) && (m2.length === 16))
|| Rngon.throw("Expected 4 x 4 matrices.");
let mResult = [];
for (let i = 0; i < 4; i++)
{
for (let j = 0; j < 4; j++)
{
mResult[i + (j * 4)] = (m1[i + (0 * 4)] * m2[0 + (j * 4)]) +
(m1[i + (1 * 4)] * m2[1 + (j * 4)]) +
(m1[i + (2 * 4)] * m2[2 + (j * 4)]) +
(m1[i + (3 * 4)] * m2[3 + (j * 4)]);
}
}
Rngon.assert && (mResult.length === 16) || Rngon.throw("Expected a 4 x 4 matrix.");
return Object.freeze(mResult);
},
});
})();
/*
* 2019, 2020 Tarpeeksi Hyvae Soft
*
* Software: Retro n-gon renderer
*
*/
"use strict";
{ // A block to limit the scope of the unit-global variables we set up, below.
// We'll sort the n-gon's vertices into those on its left side and those on its
// right side.
const leftVerts = new Array(500);
const rightVerts = new Array(500);
// Then we'll organize the sorted vertices into edges (lines between given two
// vertices). Once we've got the edges figured out, we can render the n-gon by filling
// in the spans between its edges.
const leftEdges = new Array(500).fill().map(e=>({}));
const rightEdges = new Array(500).fill().map(e=>({}));
let numLeftVerts = 0;
let numRightVerts = 0;
let numLeftEdges = 0;
let numRightEdges = 0;
// Rasterizes into the internal pixel buffer all n-gons currently stored in the
// internal n-gon cache.
//
// Note: Consider this the inner render loop; it may contain ugly things like
// code repetition for the benefit of performance. If you'd like to refactor the
// code, please benchmark its effects on performance first - maintaining or
// improving performance would be great, losing performance would be bad.
//
Rngon.ngon_filler = function(auxiliaryBuffers = [])
{
const interpolatePerspective = Rngon.internalState.usePerspectiveCorrectInterpolation;
const usePixelShader = Rngon.internalState.usePixelShader;
const fragmentBuffer = Rngon.internalState.fragmentBuffer.data;
const pixelBuffer = Rngon.internalState.pixelBuffer.data;
const depthBuffer = (Rngon.internalState.useDepthBuffer? Rngon.internalState.depthBuffer.data : null);
const renderWidth = Rngon.internalState.pixelBuffer.width;
const renderHeight = Rngon.internalState.pixelBuffer.height;
const vertexSorters =
{
verticalAscending: (vertA, vertB)=>((vertA.y === vertB.y)? 0 : ((vertA.y < vertB.y)? -1 : 1)),
verticalDescending: (vertA, vertB)=>((vertA.y === vertB.y)? 0 : ((vertA.y > vertB.y)? -1 : 1))
}
// Rasterize the n-gons.
for (let n = 0; n < Rngon.internalState.ngonCache.count; n++)
{
const ngon = Rngon.internalState.ngonCache.ngons[n];
const material = ngon.material;
let texture = null;
let textureMipLevel = null;
let textureMipLevelIdx = 0;
if (material.texture)
{
texture = material.texture;
const numMipLevels = texture.mipLevels.length;
textureMipLevelIdx = Math.max(0, Math.min((numMipLevels - 1), Math.round((numMipLevels - 1) * ngon.mipLevel)));
textureMipLevel = texture.mipLevels[textureMipLevelIdx];
}
Rngon.assert && (ngon.vertices.length < leftVerts.length)
|| Rngon.throw("Overflowing the vertex buffer");
numLeftVerts = 0;
numRightVerts = 0;
numLeftEdges = 0;
numRightEdges = 0;
// In theory, we should never receive n-gons that have no vertices, but let's check
// to make sure.
if (ngon.vertices.length <= 0)
{
continue;
}
// Rasterize a point.
if (ngon.vertices.length === 1)
{
const x = Math.min((renderWidth - 1), Math.max(0, Math.round(ngon.vertices[0].x)));
const y = Math.min((renderHeight - 1), Math.max(0, Math.round(ngon.vertices[0].y)));
const idx = ((x + y * renderWidth) * 4);
const depthBufferIdx = (idx / 4);
const depth = (ngon.vertices[0].z / Rngon.internalState.farPlaneDistance);
const shade = (material.renderVertexShade? ngon.vertices[0].shade : 1);
// Alpha test.
if (material.color.alpha !== 255) continue;
// Depth test.
if (depthBuffer && (depthBuffer[depthBufferIdx] <= depth)) continue;
const color = (texture? textureMipLevel.pixels[0] : material.color);
// Write the pixel.
{
pixelBuffer[idx + 0] = (shade * color.red);
pixelBuffer[idx + 1] = (shade * color.green);
pixelBuffer[idx + 2] = (shade * color.blue);
pixelBuffer[idx + 3] = 255;
if (depthBuffer)
{
depthBuffer[depthBufferIdx] = depth;
}
if (usePixelShader)
{
const fragment = fragmentBuffer[depthBufferIdx];
fragment.ngonIdx = n;
fragment.textureUScaled = 0;
fragment.textureVScaled = 0;
fragment.depth = depth;
fragment.shade = shade;
fragment.worldX = ngon.vertices[0].worldX;
fragment.worldY = ngon.vertices[0].worldY;
fragment.worldZ = ngon.vertices[0].worldZ;
fragment.w = ngon.vertices[0].w;
}
}
continue;
}
// Rasterize a line.
else if (ngon.vertices.length === 2)
{
Rngon.line_draw(ngon.vertices[0], ngon.vertices[1], material.color, n, false);
continue;
}
// Rasterize a polygon with 3 or more vertices.
else
{
// Figure out which of the n-gon's vertices are on its left side and which on the
// right. The vertices on both sides will be arranged from smallest Y to largest
// Y, i.e. top-to-bottom in screen space. The top-most vertex and the bottom-most
// vertex will be shared between the two sides.
{
// Generic algorithm for n-sided convex polygons.
{
// Sort the vertices by height from smallest Y to largest Y.
ngon.vertices.sort(vertexSorters.verticalAscending);
const topVert = ngon.vertices[0];
const bottomVert = ngon.vertices[ngon.vertices.length-1];
leftVerts[numLeftVerts++] = topVert;
rightVerts[numRightVerts++] = topVert;
// Trace a line along XY between the top-most vertex and the bottom-most vertex;
// and for the intervening vertices, find whether they're to the left or right of
// that line on X. Being on the left means the vertex is on the n-gon's left side,
// otherwise it's on the right side.
for (let i = 1; i < (ngon.vertices.length - 1); i++)
{
const lr = Rngon.lerp(topVert.x, bottomVert.x, ((ngon.vertices[i].y - topVert.y) / (bottomVert.y - topVert.y)));
if (ngon.vertices[i].x >= lr)
{
rightVerts[numRightVerts++] = ngon.vertices[i];
}
else
{
leftVerts[numLeftVerts++] = ngon.vertices[i];
}
}
leftVerts[numLeftVerts++] = bottomVert;
rightVerts[numRightVerts++] = bottomVert;
}
}
// Create edges out of the vertices.
{
for (let l = 1; l < numLeftVerts; l++) add_edge(leftVerts[l-1], leftVerts[l], true);
for (let r = 1; r < numRightVerts; r++) add_edge(rightVerts[r-1], rightVerts[r], false);
function add_edge(vert1, vert2, isLeftEdge)
{
const startY = Math.min(renderHeight, Math.max(0, Math.round(vert1.y)));
const endY = Math.min(renderHeight, Math.max(0, Math.round(vert2.y)));
const edgeHeight = (endY - startY);
// Ignore horizontal edges.
if (edgeHeight === 0) return;
const w1 = interpolatePerspective? vert1.w : 1;
const w2 = interpolatePerspective? vert2.w : 1;
const startX = Math.min(renderWidth, Math.max(0, Math.round(vert1.x)));
const endX = Math.min(renderWidth, Math.max(0, Math.ceil(vert2.x)));
const deltaX = ((endX - startX) / edgeHeight);
const depth1 = (vert1.z / Rngon.internalState.farPlaneDistance);
const depth2 = (vert2.z / Rngon.internalState.farPlaneDistance);
const startDepth = depth1/w1;
const deltaDepth = ((depth2/w2 - depth1/w1) / edgeHeight);
const startShade = vert1.shade/w1;
const deltaShade = ((vert2.shade/w2 - vert1.shade/w1) / edgeHeight);
const u1 = (material.texture? vert1.u : 1);
const v1 = (material.texture? vert1.v : 1);
const u2 = (material.texture? vert2.u : 1);
const v2 = (material.texture? vert2.v : 1);
const startU = u1/w1;
const deltaU = ((u2/w2 - u1/w1) / edgeHeight);
const startV = v1/w1;
const deltaV = ((v2/w2 - v1/w1) / edgeHeight);
const startInvW = 1/w1;
const deltaInvW = ((1/w2 - 1/w1) / edgeHeight);
const edge = (isLeftEdge? leftEdges[numLeftEdges++] : rightEdges[numRightEdges++]);
edge.startY = startY;
edge.endY = endY;
edge.startX = startX;
edge.deltaX = deltaX;
edge.startDepth = startDepth;
edge.deltaDepth = deltaDepth;
edge.startShade = startShade;
edge.deltaShade = deltaShade;
edge.startU = startU;
edge.deltaU = deltaU;
edge.startV = startV;
edge.deltaV = deltaV;
edge.startInvW = startInvW;
edge.deltaInvW = deltaInvW;
if (usePixelShader)
{
edge.startWorldX = vert1.worldX/w1;
edge.deltaWorldX = ((vert2.worldX/w2 - vert1.worldX/w1) / edgeHeight);
edge.startWorldY = vert1.worldY/w1;
edge.deltaWorldY = ((vert2.worldY/w2 - vert1.worldY/w1) / edgeHeight);
edge.startWorldZ = vert1.worldZ/w1;
edge.deltaWorldZ = ((vert2.worldZ/w2 - vert1.worldZ/w1) / edgeHeight);
}
}
}
// Draw the n-gon. On each horizontal raster line, there will be two edges: left and right.
// We'll render into the pixel buffer each horizontal span that runs between the two edges.
if (material.hasFill)
{
let curLeftEdgeIdx = 0;
let curRightEdgeIdx = 0;
let leftEdge = leftEdges[curLeftEdgeIdx];
let rightEdge = rightEdges[curRightEdgeIdx];
if (!numLeftEdges || !numRightEdges) continue;
// Note: We assume the n-gon's vertices to be sorted by increasing Y.
const ngonStartY = leftEdges[0].startY;
const ngonEndY = leftEdges[numLeftEdges-1].endY;
// Rasterize the n-gon in horizontal pixel spans over its height.
for (let y = ngonStartY; y < ngonEndY; y++)
{
const spanStartX = Math.min(renderWidth, Math.max(0, Math.round(leftEdge.startX)));
const spanEndX = Math.min(renderWidth, Math.max(0, Math.round(rightEdge.startX)));
const spanWidth = ((spanEndX - spanStartX) + 1);
if (spanWidth > 0)
{
const deltaDepth = ((rightEdge.startDepth - leftEdge.startDepth) / spanWidth);
let iplDepth = (leftEdge.startDepth - deltaDepth);
const deltaShade = ((rightEdge.startShade - leftEdge.startShade) / spanWidth);
let iplShade = (leftEdge.startShade - deltaShade);
const deltaU = ((rightEdge.startU - leftEdge.startU) / spanWidth);
let iplU = (leftEdge.startU - deltaU);
const deltaV = ((rightEdge.startV - leftEdge.startV) / spanWidth);
let iplV = (leftEdge.startV - deltaV);
const deltaInvW = ((rightEdge.startInvW - leftEdge.startInvW) / spanWidth);
let iplInvW = (leftEdge.startInvW - deltaInvW);
if (usePixelShader)
{
var deltaWorldX = ((rightEdge.startWorldX - leftEdge.startWorldX) / spanWidth);
var iplWorldX = (leftEdge.startWorldX - deltaWorldX);
var deltaWorldY = ((rightEdge.startWorldY - leftEdge.startWorldY) / spanWidth);
var iplWorldY = (leftEdge.startWorldY - deltaWorldY);
var deltaWorldZ = ((rightEdge.startWorldZ - leftEdge.startWorldZ) / spanWidth);
var iplWorldZ = (leftEdge.startWorldZ - deltaWorldZ);
}
// Assumes the pixel buffer consists of 4 elements per pixel (e.g. RGBA).
let pixelBufferIdx = (((spanStartX + y * renderWidth) * 4) - 4);
// Assumes the depth buffer consists of 1 element per pixel.
let depthBufferIdx = (pixelBufferIdx / 4);
// Draw the span into the pixel buffer.
for (let x = spanStartX; x < spanEndX; x++)
{
// Will hold the texture coordinates used if we end up drawing
// a textured pixel at the current x,y screen location.
let u = 0.0, v = 0.0;
// Update values that're interpolated horizontally along the span.
iplDepth += deltaDepth;
iplShade += deltaShade;
iplU += deltaU;
iplV += deltaV;
iplInvW += deltaInvW;
pixelBufferIdx += 4;
depthBufferIdx++;
if (usePixelShader)
{
iplWorldX += deltaWorldX;
iplWorldY += deltaWorldY;
iplWorldZ += deltaWorldZ;
}
const depth = (iplDepth / iplInvW);
// Depth test.
if (depthBuffer && (depthBuffer[depthBufferIdx] <= depth)) continue;
const shade = (material.renderVertexShade? (iplShade / iplInvW) : 1);
// The color we'll write into the pixel buffer for this pixel; assuming
// it passes the alpha test, the depth test, etc.
let red = 0;
let green = 0;
let blue = 0;
// Solid fill.
if (!texture)
{
// Alpha-blend the polygon. For partial transparency, we'll reject
// pixels in a particular pattern to create a see-through stipple
// effect.
if (material.allowAlphaBlend && (material.color.alpha < 255))
{
// Full transparency.
if (material.color.alpha <= 0)
{
continue;
}
// Partial transparency.
else
{
const stipplePatternIdx = Math.floor(material.color.alpha / (256 / Rngon.ngon_filler.stipple_patterns.length));
const stipplePattern    = Rngon.ngon_filler.stipple_patterns[stipplePatternIdx];
const stipplePixelIdx   = ((x % stipplePattern.width) + (y % stipplePattern.height) * stipplePattern.width);
// Reject by stipple pattern.
if (stipplePattern.pixels[stipplePixelIdx]) continue;
}
}
red   = (material.color.red   * shade);
green = (material.color.green * shade);
blue  = (material.color.blue  * shade);
}
// Textured fill.
else
{
switch (material.textureMapping)
{
// Affine mapping for power-of-two textures.
case "affine":
{
u = (iplU / iplInvW);
v = (iplV / iplInvW);
switch (material.uvWrapping)
{
case "clamp":
{
const signU = Math.sign(u);
const signV = Math.sign(v);
const upperLimit = (1 - Number.EPSILON);
u = Math.max(0, Math.min(Math.abs(u), upperLimit));
v = Math.max(0, Math.min(Math.abs(v), upperLimit));
// Negative UV coordinates flip the texture.
if (signU === -1) u = (upperLimit - u);
if (signV === -1) v = (upperLimit - v);
u *= textureMipLevel.width;
v *= textureMipLevel.height;
break;
}
case "repeat":
{
u -= Math.floor(u);
v -= Math.floor(v);
u *= textureMipLevel.width;
v *= textureMipLevel.height;
// Modulo for power-of-two. This will also flip the texture for
// negative UV coordinates.
u = (u & (textureMipLevel.width - 1));
v = (v & (textureMipLevel.height - 1));
break;
}
default: Rngon.throw("Unrecognized UV wrapping mode."); break;
}
break;
}
// Affine mapping for wrapping non-power-of-two textures.
/// FIXME: This implementation is a bit kludgy.
/// TODO: Add clamped UV wrapping mode (we can just use the one for
/// power-of-two textures).
case "affine-npot":
{
u = (iplU / iplInvW);
v = (iplV / iplInvW);
u *= textureMipLevel.width;
v *= textureMipLevel.height;
// Wrap with repetition.
/// FIXME: Why do we need to test for UV < 0 even when using positive
/// but tiling UV coordinates? Doesn't render properly unless we do.
if ((u < 0) ||
(v < 0) ||
(u >= textureMipLevel.width) ||
(v >= textureMipLevel.height))
{
const uWasNeg = (u < 0);
const vWasNeg = (v < 0);
u = (Math.abs(u) % textureMipLevel.width);
v = (Math.abs(v) % textureMipLevel.height);
if (uWasNeg) u = (textureMipLevel.width - u);
if (vWasNeg) v = (textureMipLevel.height - v);
}
break;
}
// Screen-space UV mapping, as used e.g. in the DOS game Rally-Sport.
case "ortho":
{
const ngonHeight = (ngonEndY - ngonStartY);
// Pixel coordinates relative to the polygon.
const ngonX = (x - spanStartX + 1);
const ngonY = (y - ngonStartY + 1);
u = (ngonX * (textureMipLevel.width / spanWidth));
v = (ngonY * (textureMipLevel.height / ngonHeight));
// The texture image is flipped, so we need to flip V as well.
v = (textureMipLevel.height - v);
break;
}
default: Rngon.throw("Unknown texture-mapping mode."); break;
}
const texel = textureMipLevel.pixels[(~~u) + (~~v) * textureMipLevel.width];
// Make sure we gracefully exit if accessing the texture out of bounds.
if (!texel) continue;
// Alpha-test the texture. If the texel isn't fully opaque, skip it.
if (material.allowAlphaReject && (texel.alpha !== 255)) continue;
// Alpha-blend the polygon. For partial transparency, we'll reject
// pixels in a particular pattern to create a see-through stipple
// effect.
if (material.allowAlphaBlend && (material.color.alpha < 255))
{
// Full transparency.
if (material.color.alpha <= 0)
{
continue;
}
// Partial transparency.
else
{
const stipplePatternIdx = Math.floor(material.color.alpha / (256 / Rngon.ngon_filler.stipple_patterns.length));
const stipplePattern    = Rngon.ngon_filler.stipple_patterns[stipplePatternIdx];
const stipplePixelIdx   = ((x % stipplePattern.width) + (y % stipplePattern.height) * stipplePattern.width);
// Reject by stipple pattern.
if (stipplePattern.pixels[stipplePixelIdx]) continue;
}
}
red   = (texel.red   * material.color.unitRange.red   * shade);
green = (texel.green * material.color.unitRange.green * shade);
blue  = (texel.blue  * material.color.unitRange.blue  * shade);
}
// The pixel passed its alpha test, depth test, etc., and should be drawn
// on screen.
{
pixelBuffer[pixelBufferIdx + 0] = red;
pixelBuffer[pixelBufferIdx + 1] = green;
pixelBuffer[pixelBufferIdx + 2] = blue;
pixelBuffer[pixelBufferIdx + 3] = 255;
if (depthBuffer)
{
depthBuffer[depthBufferIdx] = depth;
}
for (let b = 0; b < auxiliaryBuffers.length; b++)
{
if (material.auxiliary[auxiliaryBuffers[b].property] !== null)
{
// Buffers are expected to consist of one element per pixel.
auxiliaryBuffers[b].buffer[depthBufferIdx] = material.auxiliary[auxiliaryBuffers[b].property];
}
}
if (usePixelShader)
{
const fragment = fragmentBuffer[depthBufferIdx];
fragment.ngonIdx = n;
fragment.textureUScaled = ~~u;
fragment.textureVScaled = ~~v;
fragment.depth = (iplDepth / iplInvW);
fragment.shade = (iplShade / iplInvW);
fragment.worldX = (iplWorldX / iplInvW);
fragment.worldY = (iplWorldY / iplInvW);
fragment.worldZ = (iplWorldZ / iplInvW);
fragment.w = (1 / iplInvW);
}
}
}
}
// Update values that're interpolated vertically along the edges.
{
leftEdge.startX      += leftEdge.deltaX;
leftEdge.startDepth  += leftEdge.deltaDepth;
leftEdge.startShade  += leftEdge.deltaShade;
leftEdge.startU      += leftEdge.deltaU;
leftEdge.startV      += leftEdge.deltaV;
leftEdge.startInvW   += leftEdge.deltaInvW;
rightEdge.startX     += rightEdge.deltaX;
rightEdge.startDepth += rightEdge.deltaDepth;
rightEdge.startShade += rightEdge.deltaShade;
rightEdge.startU     += rightEdge.deltaU;
rightEdge.startV     += rightEdge.deltaV;
rightEdge.startInvW  += rightEdge.deltaInvW;
if (usePixelShader)
{
leftEdge.startWorldX  += leftEdge.deltaWorldX;
leftEdge.startWorldY  += leftEdge.deltaWorldY;
leftEdge.startWorldZ  += leftEdge.deltaWorldZ;
rightEdge.startWorldX += rightEdge.deltaWorldX;
rightEdge.startWorldY += rightEdge.deltaWorldY;
rightEdge.startWorldZ += rightEdge.deltaWorldZ;
}
}
// We can move onto the next edge when we're at the end of the current one.
if (y === (leftEdge.endY - 1)) leftEdge = leftEdges[++curLeftEdgeIdx];
if (y === (rightEdge.endY - 1)) rightEdge = rightEdges[++curRightEdgeIdx];
}
}
// Draw a wireframe around any n-gons that wish for one.
if (Rngon.internalState.showGlobalWireframe ||
material.hasWireframe)
{
for (let l = 1; l < numLeftVerts; l++)
{
Rngon.line_draw(leftVerts[l-1], leftVerts[l], material.wireframeColor, n, true);
}
for (let r = 1; r < numRightVerts; r++)
{
Rngon.line_draw(rightVerts[r-1], rightVerts[r], material.wireframeColor, n, true);
}
}
}
}
return;
}
// Create a set of stipple patterns for emulating transparency.
{
Rngon.ngon_filler.stipple_patterns = [
// ~1% transparent.
{
width: 8,
height: 6,
pixels: [0,1,1,1,0,1,1,1,
1,1,1,1,1,1,1,1,
1,1,1,1,1,1,1,1,
1,1,0,1,1,1,0,1,
1,1,1,1,1,1,1,1,
1,1,1,1,1,1,1,1],
},
{
width: 4,
height: 4,
pixels: [0,1,0,1,
1,1,1,1,
1,0,1,0,
1,1,1,1],
},
// 50% transparent.
{
width: 2,
height: 2,
pixels: [1,0,
0,1],
},
];
// Append a reverse set of patterns to go from 50% to ~99% transparent.
for (let i = (Rngon.ngon_filler.stipple_patterns.length - 2); i >= 0; i--)
{
Rngon.ngon_filler.stipple_patterns.push({
width: Rngon.ngon_filler.stipple_patterns[i].width,
height: Rngon.ngon_filler.stipple_patterns[i].height,
pixels: Rngon.ngon_filler.stipple_patterns[i].pixels.map(p=>Number(!p)),
});
}
}
}
/*
* Tarpeeksi Hyvae Soft 2019 /
* Retro n-gon renderer
*
*/
"use strict";
// Applies lighting to the given n-gons, and transforms them into screen space
// for rendering. The processed n-gons are stored in the internal n-gon cache.
Rngon.ngon_transform_and_light = function(ngons = [],
objectMatrix = [],
cameraMatrix = [],
projectionMatrix = [],
screenSpaceMatrix = [],
cameraPos)
{
const viewVector = {x:0.0, y:0.0, z:0.0};
const ngonCache = Rngon.internalState.ngonCache;
const clipSpaceMatrix = Rngon.matrix44.multiply(projectionMatrix, cameraMatrix);
for (const ngon of ngons)
{
// Ignore fully transparent polygons.
if (!ngon.material.color.alpha &&
!ngon.material.hasWireframe)
{
continue;
}
// Backface culling.
if (!ngon.material.isTwoSided)
{
viewVector.x = (ngon.vertices[0].x - cameraPos.x);
viewVector.y = (ngon.vertices[0].y - cameraPos.y);
viewVector.z = (ngon.vertices[0].z - cameraPos.z);
if (Rngon.vector3.dot(ngon.normal, viewVector) >= 0)
{
continue;
}
}
// Copy the ngon into the internal n-gon cache, so we can operate on it without
// mutating the original n-gon's data.
const cachedNgon = ngonCache.ngons[ngonCache.count++];
{
cachedNgon.vertices.length = 0;
for (let v = 0; v < ngon.vertices.length; v++)
{
cachedNgon.vertices[v] = Rngon.vertex(ngon.vertices[v].x,
ngon.vertices[v].y,
ngon.vertices[v].z,
ngon.vertices[v].u,
ngon.vertices[v].v,
ngon.vertices[v].w,
ngon.vertices[v].shade);
if (Rngon.internalState.useVertexShader ||
(ngon.material.vertexShading === "gouraud"))
{
cachedNgon.vertexNormals[v] = Rngon.vector3(ngon.vertexNormals[v].x,
ngon.vertexNormals[v].y,
ngon.vertexNormals[v].z);
}
}
cachedNgon.material = ngon.material;
cachedNgon.normal.x = ngon.normal.x;
cachedNgon.normal.y = ngon.normal.y;
cachedNgon.normal.z = ngon.normal.z;
cachedNgon.isActive = true;
cachedNgon.mipLevel = ngon.mipLevel;
}
// Transform vertices into screen space and apply clipping. We'll do the transforming
// in steps: first into object space, then into clip space, and finally into screen
// space.
if (cachedNgon.material.allowTransform)
{
// Object space. Any built-in lighting is applied, if requested by the n-gon's
// material.
{
Rngon.ngon.transform(cachedNgon, objectMatrix);
// Interpolated world XYZ coordinates will be made available to shaders,
// but aren't needed if shaders are disabled.
if (Rngon.internalState.usePixelShader)
{
for (let v = 0; v < cachedNgon.vertices.length; v++)
{
cachedNgon.vertices[v].worldX = cachedNgon.vertices[v].x;
cachedNgon.vertices[v].worldY = cachedNgon.vertices[v].y;
cachedNgon.vertices[v].worldZ = cachedNgon.vertices[v].z;
}
}
// If using Gouraud shading, we need to transform all vertex normals; but
// the face normal won't be used and so can be ignored.
if (Rngon.internalState.useVertexShader ||
(cachedNgon.material.vertexShading === "gouraud"))
{
for (let v = 0; v < cachedNgon.vertices.length; v++)
{
Rngon.vector3.transform(cachedNgon.vertexNormals[v], objectMatrix);
Rngon.vector3.normalize(cachedNgon.vertexNormals[v]);
}
}
// With shading other than Gouraud, only the face normal will be used, and
// we can ignore the vertex normals.
else
{
Rngon.vector3.transform(cachedNgon.normal, objectMatrix);
Rngon.vector3.normalize(cachedNgon.normal);
}
if (cachedNgon.material.vertexShading !== "none")
{
Rngon.ngon_transform_and_light.apply_lighting(cachedNgon);
}
// Apply an optional, user-defined vertex shader.
if (Rngon.internalState.useVertexShader)
{
const args = [
cachedNgon,
cameraPos,
];
const paramNamesString = "ngon, cameraPos";
switch (typeof Rngon.internalState.vertex_shader)
{
case "function":
{
Rngon.internalState.vertex_shader(...args);
break;
}
// Shader functions as strings are supported to allow shaders to be
// used in Web Workers. These strings are expected to be of - or
// equivalent to - the form "(a)=>{console.log(a)}".
case "string":
{
Function(paramNamesString, `(${Rngon.internalState.vertex_shader})(${paramNamesString})`)(...args);
break;
}
default:
{
Rngon.throw("Unrecognized type of vertex shader function.");
break;
}
}
}
}
// Clip space. Vertices that fall outside of the view frustum will be removed.
{
Rngon.ngon.transform(cachedNgon, clipSpaceMatrix);
if (Rngon.internalState.applyViewportClipping)
{
Rngon.ngon.clip_to_viewport(cachedNgon);
}
// If there are no vertices left after clipping, it means this n-gon is
// not visible on the screen at all, and so we don't need to consider it
// for rendering.
if (!cachedNgon.vertices.length)
{
ngonCache.count--;
continue;
}
}
// Screen space. Vertices will be transformed such that their XY coordinates
// map directly into XY pixel coordinates in the rendered image (although
// the values may still be in floating-point).
{
Rngon.ngon.transform(cachedNgon, screenSpaceMatrix);
Rngon.ngon.perspective_divide(cachedNgon);
}
}
};
// Mark as inactive any cached n-gons that we didn't touch, so the renderer knows
// to ignore them for the current frame.
for (let i = ngonCache.count; i < ngonCache.ngons.length; i++)
{
ngonCache.ngons[i].isActive = false;
}
return;
}
Rngon.ngon_transform_and_light.apply_lighting = function(ngon)
{
// Pre-allocate a vector object to operate on, so we don't need to create one repeatedly.
const lightDirection = Rngon.vector3();
let faceShade = ngon.material.ambientLightLevel;
for (let v = 0; v < ngon.vertices.length; v++)
{
ngon.vertices[v].shade = ngon.material.ambientLightLevel;
}
// Get the average XYZ point on this n-gon's face.
let faceX = 0, faceY = 0, faceZ = 0;
if (ngon.material.vertexShading === "flat")
{
for (const vertex of ngon.vertices)
{
faceX += vertex.x;
faceY += vertex.y;
faceZ += vertex.z;
}
faceX /= ngon.vertices.length;
faceY /= ngon.vertices.length;
faceZ /= ngon.vertices.length;
}
// Find the brightest shade falling on this n-gon.
for (const light of Rngon.internalState.lights)
{
// If we've already found the maximum brightness, we don't need to continue.
//if (shade >= 255) break;
if (ngon.material.vertexShading === "gouraud")
{
for (let v = 0; v < ngon.vertices.length; v++)
{
const vertex = ngon.vertices[v];
const distance = Math.sqrt(((vertex.x - light.position.x) * (vertex.x - light.position.x)) +
((vertex.y - light.position.y) * (vertex.y - light.position.y)) +
((vertex.z - light.position.z) * (vertex.z - light.position.z)));
const distanceMul = (1 / (1 + (light.attenuation * distance)));
lightDirection.x = (light.position.x - vertex.x);
lightDirection.y = (light.position.y - vertex.y);
lightDirection.z = (light.position.z - vertex.z);
Rngon.vector3.normalize(lightDirection);
const shadeFromThisLight = Math.max(0, Math.min(1, Rngon.vector3.dot(ngon.vertexNormals[v], lightDirection)));
vertex.shade = Math.max(vertex.shade, Math.min(light.clip, (shadeFromThisLight * distanceMul * light.intensity)));
}
}
else if (ngon.material.vertexShading === "flat")
{
const distance = Math.sqrt(((faceX - light.position.x) * (faceX - light.position.x)) +
((faceY - light.position.y) * (faceY - light.position.y)) +
((faceZ - light.position.z) * (faceZ - light.position.z)));
const distanceMul = (1 / (1 + (light.attenuation * distance)));
lightDirection.x = (light.position.x - faceX);
lightDirection.y = (light.position.y - faceY);
lightDirection.z = (light.position.z - faceZ);
Rngon.vector3.normalize(lightDirection);
const shadeFromThisLight = Math.max(0, Math.min(1, Rngon.vector3.dot(ngon.normal, lightDirection)));
faceShade = Math.max(faceShade, Math.min(light.clip, (shadeFromThisLight * distanceMul * light.intensity)));
}
else
{
Rngon.throw("Unknown shading mode.");
}
}
if (ngon.material.vertexShading === "flat")
{
for (let v = 0; v < ngon.vertices.length; v++)
{
ngon.vertices[v].shade = faceShade;
}
}
return;
}
/*
* Tarpeeksi Hyvae Soft 2019 /
* Retro n-gon renderer
*
*/
"use strict";
// Renders the given meshes onto a given DOM <canvas> element. Note that the target element
// must already exist.
Rngon.render = function(canvasElement,
meshes = [Rngon.mesh()],
options = {})
{
const renderCallInfo = Rngon.renderShared.setup_render_call_info();
// The canvas element can be passed in in a couple of ways, e.g. as a string that
// identifies the DOM element, or directly as a DOM element object. So let's figure
// out what we received, and turn it into a DOM element object for the renderer
// to operate on.
{
if (typeof canvasElement == "string")
{
canvasElement = document.getElementById(canvasElement);
}
else if (!(canvasElement instanceof Element))
{
Rngon.throw("Invalid canvas element.");
}
}
options = Object.freeze({
...Rngon.renderShared.defaultRenderOptions,
...options
});
Rngon.renderShared.initialize_internal_render_state(options);
// Render a single frame onto the target <canvas> element.
{
const renderSurface = Rngon.surface(canvasElement, options);
// We'll render either always or only when the render canvas is in view,
// depending on whether the user asked us for the latter option.
if (renderSurface &&
(!options.hibernateWhenNotOnScreen || renderSurface.is_in_view()))
{
renderSurface.display_meshes(meshes);
renderCallInfo.renderWidth = renderSurface.width;
renderCallInfo.renderHeight = renderSurface.height;
renderCallInfo.numNgonsRendered = Rngon.internalState.ngonCache.count;
}
}
renderCallInfo.totalRenderTimeMs = (performance.now() - renderCallInfo.totalRenderTimeMs);
return renderCallInfo;
};
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: Retro n-gon renderer
*
*/
"use strict";
// Renders a single frame of the given meshes into an off-screen buffer (no
// dependency on the DOM, unlike Rngon.render() which renders into a <canvas>).
//
// The rendering is non-blocking and will be performed in a Worker thread.
//
// Returns a Promise that resolves with the following object:
//
//     {
//         image: <the rendered image as an ImageData object>,
//         renderWidth: <width of the rendered image>,
//         renderHeight: <height of the rendered image>,
//         totalRenderTimeMs: <number of milliseconds taken by the rendering>,
//     }
//
// On error, the Promise rejects with a string describing the error in plain language.
//
Rngon.render_async = function(meshes = [Rngon.mesh()],
options = {},
rngonUrl = null)
{
// Modules are not supported by the async renderer.
options.modules = {
ngonFill: null,
transformClipLight: null,
};
return new Promise((resolve, reject)=>
{
// Spawn a new render worker with the render_worker() function as its body.
const workerThread = new Worker(URL.createObjectURL(new Blob([`(${render_worker.toString()})()`],
{
type: 'text/javascript',
})));
// Listen for messages from the worker.
workerThread.onmessage = (message)=>
{
// For now, we assume that the worker will only send one message: either that
// it's finished rendering, or that something went wrong. So once we've received
// this first message, the worker has done its thing, and we can terminate it.
workerThread.terminate();
message = message.data;
if (typeof message.type !== "string")
{
reject("A render worker sent an invalid message.");
return;
}
switch (message.type)
{
case "rendering-finished":
{
// Remove properties that we don't need to report back.
delete message.type;
resolve(message);
break;
}
case "error":
{
reject(`A render worker reported the following error: ${message.errorText}`);
break;
}
default:
{
reject("A render worker sent an unrecognized message.");
break;
}
}
}
if (rngonUrl === null)
{
rngonUrl = Array.from(document.getElementsByTagName("script")).filter(e=>e.src.endsWith("rngon.cat.js"))[0].src;
}
// Tell the worker to render the given meshes.
workerThread.postMessage({
type: "render",
meshes,
options,
rngonUrl,
});
});
// The function we'll run as a Worker thread to perform the rendering.
//
// To ask this function to render an array of Rngon.mesh() objects into an off-screen
// pixel buffer, post to it the following message, via postMessage():
//
//     {
//         type: "render",
//         meshes: [<your mesh array>],
//         options: {<options to Rngon.render()},
//         rngonUrl: `${window.location.origin}/distributable/rngon.cat.js`,
//     }
//
// On successful completion of the rendering, the function will respond with the
// following message, via postMessage():
//
//     {
//         type: "rendering-finished",
//         image: <the rendered image as an ImageData object>,
//         renderWidth: <width of the rendered image>,
//         renderHeight: <height of the rendered image>,
//         totalRenderTimeMs: <number of milliseconds taken by the rendering>,
//     }
//
// On error, the function will respond with the following message, via postMessage():
//
//     {
//         type: "error",
//         errorText: <a string describing the error in plain language>,
//     }
//
function render_worker()
{
onmessage = (message)=>
{
message = message.data;
if (typeof message.type !== "string")
{
postMessage({
type: "error",
errorText: "A render worker received an invalid message.",
});
return;
}
switch (message.type)
{
// Render the meshes provided in the message, and in return postMessage() the
// resulting pixel buffer.
case "render":
{
try
{
importScripts(message.rngonUrl);
render(message.meshes, message.options);
}
catch (error)
{
postMessage({
type: "error",
errorText: error.message,
});
}
break;
}
default:
{
postMessage({
type: "error",
errorText: "Received an unrecognized message.",
});
break;
}
}
};
// Renders the given meshes into the internal pixel buffer, Rngon.internalState.pixelBuffer.
function render(meshes, renderOptions)
{
if (!Array.isArray(meshes))
{
Rngon.throw("Expected meshes to be provided in an array.");
return;
}
const renderCallInfo = Rngon.renderShared.setup_render_call_info();
const options = Object.freeze({
...Rngon.renderShared.defaultRenderOptions,
...renderOptions,
});
Rngon.renderShared.initialize_internal_render_state(options);
// Disable the use of window.alert() while inside a Worker.
Rngon.internalState.allowWindowAlert = false;
// Render a single frame.
{
const renderSurface = Rngon.surface(null, options);
if (renderSurface)
{
renderSurface.display_meshes(meshes);
renderCallInfo.renderWidth = options.width;
renderCallInfo.renderHeight = options.height;
renderCallInfo.numNgonsRendered = Rngon.internalState.ngonCache.count;
renderCallInfo.image = Rngon.internalState.pixelBuffer;
}
else
{
Rngon.throw("Failed to initialize the render surface.");
return;
}
}
renderCallInfo.totalRenderTimeMs = (performance.now() - renderCallInfo.totalRenderTimeMs);
postMessage({
...renderCallInfo,
type: "rendering-finished",
});
return;
}
return;
}
}
/*
* Tarpeeksi Hyvae Soft 2019 /
* Retro n-gon renderer
*
*/
"use strict";
// Functionality that may be shared between different implementations of Rngon.render()
// and perhaps called by other subsystems, like Rngon.surface().
Rngon.renderShared = {
// The 'options' object is a reference to or copy of the options passed to render().
initialize_internal_render_state: function(options = {})
{
const state = Rngon.internalState;
state.useDepthBuffer = Boolean(options.useDepthBuffer);
state.showGlobalWireframe = Boolean(options.globalWireframe);
state.applyViewportClipping = Boolean(options.clipToViewport);
state.lights = options.lights;
state.farPlaneDistance = options.farPlane;
state.usePerspectiveCorrectInterpolation = Boolean((options.perspectiveCorrectTexturing || // <- Name in pre-beta.2.
options.perspectiveCorrectInterpolation));
state.useVertexShader = Boolean(options.vertexShader);
state.vertex_shader = options.vertexShader;
state.usePixelShader = Boolean(options.pixelShader);
state.pixel_shader = (options.shaderFunction || // <- Name in pre-beta.3.
options.pixelShader);
state.modules.ngon_fill = (options.modules.ngonFill || Rngon.ngon_filler);
state.modules.transform_clip_light = (options.modules.transformClipLight || Rngon.ngon_transform_and_light)
state.modules.surface_wipe = (options.modules.surfaceWipe || Rngon.surface.wipe);
return;
},
// Creates or resizes the n-gon cache to fit at least the number of n-gons contained
// in the given array of meshes.
prepare_ngon_cache: function(meshes = [])
{
Rngon.assert && (meshes instanceof Array)
|| Rngon.throw("Invalid arguments to n-gon cache initialization.");
const ngonCache = Rngon.internalState.ngonCache;
const sceneNgonCount = meshes.reduce((totalCount, mesh)=>(totalCount + mesh.ngons.length), 0);
if (!ngonCache ||
!ngonCache.ngons.length ||
(ngonCache.ngons.length < sceneNgonCount))
{
const lengthDelta = (sceneNgonCount - ngonCache.ngons.length);
ngonCache.ngons.push(...new Array(lengthDelta).fill().map(e=>Rngon.ngon()));
}
ngonCache.count = 0;
return;
},
// Sorts all vertices in the n-gon cache by their Z coordinate.
depth_sort_ngon_cache: function(depthSortinMode = "")
{
const ngons = Rngon.internalState.ngonCache.ngons;
switch (depthSortinMode)
{
case "none": break;
// Painter's algorithm. Sort back-to-front; i.e. so that n-gons furthest from the camera
// will be first in the list.
case "painter":
{
ngons.sort((ngonA, ngonB)=>
{
// Separate inactive n-gons (which are to be ignored when rendering the current
// frame) from the n-gons we're intended to render.
const a = (ngonA.isActive? (ngonA.vertices.reduce((acc, v)=>(acc + v.z), 0) / ngonA.vertices.length) : -Number.MAX_VALUE);
const b = (ngonB.isActive? (ngonB.vertices.reduce((acc, v)=>(acc + v.z), 0) / ngonB.vertices.length) : -Number.MAX_VALUE);
return ((a === b)? 0 : ((a < b)? 1 : -1));
});
break;
}
// Sort front-to-back; i.e. so that n-gons closest to the camera will be first in the
// list. When used together with depth buffering, allows for early rejection of occluded
// pixels during rasterization.
case "painter-reverse":
default:
{
ngons.sort((ngonA, ngonB)=>
{
// Separate inactive n-gons (which are to be ignored when rendering the current
// frame) from the n-gons we're intended to render.
const a = (ngonA.isActive? (ngonA.vertices.reduce((acc, v)=>(acc + v.z), 0) / ngonA.vertices.length) : Number.MAX_VALUE);
const b = (ngonB.isActive? (ngonB.vertices.reduce((acc, v)=>(acc + v.z), 0) / ngonB.vertices.length) : Number.MAX_VALUE);
return ((a === b)? 0 : ((a > b)? 1 : -1));
});
break;
}
}
return;
},
// Marks any non-power-of-two affine-mapped faces in the n-gon cache as using the
// non-power-of-two affine texture mapper. This needs to be done since the default
// affine mapper expects textures to be power-of-two.
mark_npot_textures_in_ngon_cache: function()
{
for (let i = 0; i < Rngon.internalState.ngonCache.count; i++)
{
const ngon = Rngon.internalState.ngonCache.ngons[i];
if (ngon.material.texture &&
ngon.material.textureMapping === "affine")
{
let widthIsPOT = ((ngon.material.texture.width & (ngon.material.texture.width - 1)) === 0);
let heightIsPOT = ((ngon.material.texture.height & (ngon.material.texture.height - 1)) === 0);
if (ngon.material.texture.width === 0) widthIsPOT = false;
if (ngon.material.texture.height === 0) heightIsPOT = false;
if (!widthIsPOT || !heightIsPOT)
{
ngon.material.textureMapping = "affine-npot";
}
}
}
return;
},
// (See the root README.md for documentation on these parameters.)
defaultRenderOptions: Object.freeze({
cameraPosition: Rngon.vector3(0, 0, 0),
cameraDirection: Rngon.vector3(0, 0, 0),
pixelShader: null, // If null, all pixel shader functionality will be disabled.
vertexShader: null, // If null, all vertex shader functionality will be disabled.
scale: 1,
fov: 43,
nearPlane: 1,
farPlane: 1000,
depthSort: "", // An empty string will make the renderer use its default depth sort option.
useDepthBuffer: true,
clipToViewport: true,
globalWireframe: false,
hibernateWhenNotOnScreen: true,
perspectiveCorrectInterpolation: false,
auxiliaryBuffers: [],
lights: [],
width: 640, // Used by render_async() only.
height: 480, // Used by render_async() only.
modules: {
ngonFill: null, // Null defaults to Rngon.ngon_filler.
transformClipLight: null, // Null defaults to Rngon.ngon_transform_and_light.
},
}),
// Returns an object containing the properties - and their defualt starting values -
// that a call to render() should return.
setup_render_call_info: function()
{
return {
renderWidth: 0,
renderHeight: 0,
// The total count of n-gons rendered. May be smaller than the number of n-gons
// originally submitted for rendering, due to visibility culling etc. performed
// during the rendering process.
numNgonsRendered: 0,
// The total time this call to render() took, in milliseconds.
totalRenderTimeMs: performance.now(),
};
},
}
/*
* Tarpeeksi Hyvae Soft 2019 /
* Retro n-gon renderer
*
*/
"use strict";
// A 32-bit texture.
Rngon.texture_rgba = function(data = {})
{
// Append default parameter arguments.
data =
{
...{
width: 0,
height: 0,
pixels: [],
encoding: "none",
channels: "rgba:8+8+8+8",
needsFlip: true,
},
...data,
}
// The maximum dimensions of a texture.
const maxWidth = 32768;
const maxHeight = 32768;
const numColorChannels = 4;
Rngon.assert && (Number.isInteger(data.width) && Number.isInteger(data.height))
|| Rngon.throw("Expected texture width and height to be integer values.");
Rngon.assert && (data.width >= 0 && data.height >= 0)
|| Rngon.throw("Expected texture width and height to be no less than zero.");
Rngon.assert && (data.width <= maxWidth && data.height <= maxHeight)
|| Rngon.throw("Expected texture width/height to be no more than " + maxWidth + "/" + maxHeight + ".");
// If necessary, decode the pixel data into raw RGBA/8888.
if (data.encoding !== "none")
{
// In Base64-encoded data, each pixel's RGBA is expected to be given as a 16-bit
// value, where each of the RGB channels takes up 5 bits and the alpha channel
// 1 bit.
if (data.encoding === "base64")
{
Rngon.assert && (data.channels === "rgba:5+5+5+1")
|| Rngon.throw("Expected Base64-encoded data to be in RGBA 5551 format.");
data.pixels = (()=>
{
const rgba = [];
const decoded = atob(data.pixels);
// We should have an array where each pixel is a 2-byte value.
Rngon.assert && (decoded.length === (data.width * data.height * 2))
|| Rngon.throw("Unexpected data length for a Base64-encoded texture.");
for (let i = 0; i < (data.width * data.height * 2); i += 2)
{
const p = (decoded.charCodeAt(i) | (decoded.charCodeAt(i+1)<<8));
rgba.push((p         & 0x1f) * 8);  // Red.
rgba.push(((p >> 5)  & 0x1f) * 8);  // Green.
rgba.push(((p >> 10) & 0x1f) * 8);  // Blue.
rgba.push(((p >> 15) & 1) * 255);   // Alpha.
}
return rgba;
})();
}
else if (data.encoding !== "none")
{
Rngon.throw("Unknown texture data encoding '" + data.encoding + "'.");
}
}
Rngon.assert && (data.pixels.length === (data.width * data.height * numColorChannels))
|| Rngon.throw("The texture's pixel array size doesn't match its width and height.");
// Convert the raw pixel data into objects of the form {red, green, blue, alpha}.
// Note: We also flip the texture on the Y axis, to counter the fact that textures
// become flipped on Y during rendering (i.e. we pre-emptively un-flip it, here).
const pixelArray = [];
for (let y = 0; y < data.height; y++)
{
for (let x = 0; x < data.width; x++)
{
const idx = ((x + (data.needsFlip? (data.height - y - 1) : y) * data.width) * numColorChannels);
pixelArray.push({red:   data.pixels[idx + 0],
green: data.pixels[idx + 1],
blue:  data.pixels[idx + 2],
alpha: data.pixels[idx + 3]});
}
}
// Generate mipmaps. Each successive mipmap is one half of the previous
// mipmap's width and height, starting from the full resolution and working
// down to 1 x 1. So mipmaps[0] is the original, full-resolution texture,
// and mipmaps[mipmaps.length-1] is the smallest, 1 x 1 texture.
const mipmaps = [];
for (let m = 0; ; m++)
{
const mipWidth = Math.max(1, Math.floor(data.width / Math.pow(2, m)));
const mipHeight = Math.max(1, Math.floor(data.height / Math.pow(2, m)));
// Downscale the texture image to the next mip level.
const mipPixelData = [];
{
const deltaW = (data.width / mipWidth);
const deltaH = (data.height / mipHeight);
for (let y = 0; y < mipHeight; y++)
{
for (let x = 0; x < mipWidth; x++)
{
const dstIdx = (x + y * mipWidth);
const srcIdx = (Math.floor(x * deltaW) + Math.floor(y * deltaH) * data.width);
mipPixelData[dstIdx] = pixelArray[srcIdx];
}
}
}
mipmaps.push({
width: mipWidth,
height: mipHeight,
pixels: mipPixelData,
});
// We're finished generating mip levels once we've done them down to 1 x 1.
if ((mipWidth === 1) && (mipHeight === 1))
{
Rngon.assert && (mipmaps.length > 0)
|| Rngon.throw("Failed to generate mip levels for a texture.");
break;
}
}
const publicInterface =
{
width: data.width,
height: data.height,
pixels: pixelArray,
mipLevels: mipmaps,
};
return publicInterface;
}
// Returns a new texture whose data are a deep copy of the given texture.
Rngon.texture_rgba.deep_copy = function(texture)
{
const copiedPixels = new Array(texture.width * texture.height * 4);
for (let i = 0; i< (texture.width * texture.height); i++)
{
copiedPixels[i*4+0] = texture.pixels[i].red;
copiedPixels[i*4+1] = texture.pixels[i].green;
copiedPixels[i*4+2] = texture.pixels[i].blue;
copiedPixels[i*4+3] = texture.pixels[i].alpha;
}
return Rngon.texture_rgba({
width: texture.width,
height: texture.height,
pixels: copiedPixels,
needsFlip: false,
});
}
// Returns a Promise of a texture whose data is loaded from the given file. The actual
// texture is returned once the data has been loaded.
// Note: Only supports JSON files at the moment, expecting them to contain a valid
// object to be passed as-is into texture_rgba().
Rngon.texture_rgba.create_with_data_from_file = function(filename)
{
return new Promise((resolve, reject)=>
{
fetch(filename)
.then((response)=>response.json())
.then((data)=>
{
resolve(Rngon.texture_rgba(data));
})
.catch((error)=>{Rngon.throw("Failed to create a texture with data from file '" + filename + "'. Error: '" + error + "'.")});
});
}
/*
* 2019, 2020 Tarpeeksi Hyvae Soft
*
* Software: Retro n-gon renderer
*
*/
"use strict";
// A surface for rendering onto. Will also paint the rendered image onto a HTML5 <canvas>
// element unless the 'canvasElementId' parameter is null, in which case rendering will be
// to an off-screen buffer only.
//
// Returns null if the surface could not be created.
Rngon.surface = function(canvasElement,  // The target DOM <canvas> element.
options = {})   // A reference to or copy of the options passed to render().
{
const renderOffscreen = Boolean(canvasElement === null);
let surfaceWidth = undefined,
surfaceHeight = undefined,
renderContext = undefined;
try
{
if (renderOffscreen)
{
({surfaceWidth, surfaceHeight} = setup_offscreen(options.width, options.height));
}
else
{
({surfaceWidth,
surfaceHeight,
canvasElement,
renderContext} = setup_onscreen(canvasElement, options.scale));
}
initialize_internal_surface_state(surfaceWidth, surfaceHeight);
}
catch (error)
{
Rngon.log(`Failed to create a render surface. ${error}`);
return null;
}
const cameraMatrix = Rngon.matrix44.multiply(Rngon.matrix44.rotation(options.cameraDirection.x,
options.cameraDirection.y,
options.cameraDirection.z),
Rngon.matrix44.translation(-options.cameraPosition.x,
-options.cameraPosition.y,
-options.cameraPosition.z));
const perspectiveMatrix = Rngon.matrix44.perspective((options.fov * Math.PI/180),
(surfaceWidth / surfaceHeight),
options.nearPlane,
options.farPlane);
const screenSpaceMatrix = Rngon.matrix44.ortho((surfaceWidth + 1), (surfaceHeight + 1));
const publicInterface = Object.freeze(
{
width: surfaceWidth,
height: surfaceHeight,
// Rasterizes the given meshes' n-gons onto this surface. Following this call,
// the rasterized pixels will be in Rngon.internalState.pixelBuffer, and the
// meshes' n-gons - with their vertices transformed to screen space - in
// Rngon.internalState.ngonCache. If a <canvas> element id was specified for
// this surface, the rasterized pixels will also be painted onto that canvas.
display_meshes: function(meshes = [])
{
Rngon.internalState.modules.surface_wipe();
// Prepare the meshes' n-gons for rendering. This will place the transformed
// n-gons into the internal n-gon cache, Rngon.internalState.ngonCache.
{
Rngon.renderShared.prepare_ngon_cache(meshes);
for (const mesh of meshes)
{
Rngon.internalState.modules.transform_clip_light(
mesh.ngons,
Rngon.mesh.object_space_matrix(mesh),
cameraMatrix,
perspectiveMatrix,
screenSpaceMatrix,
options.cameraPosition);
};
Rngon.renderShared.mark_npot_textures_in_ngon_cache();
Rngon.renderShared.depth_sort_ngon_cache(options.depthSort);
}
// Render the n-gons from the n-gon cache. The rendering will go into the
// renderer's internal pixel buffer, Rngon.internalState.pixelBuffer.
{
Rngon.internalState.modules.ngon_fill(options.auxiliaryBuffers);
if (Rngon.internalState.usePixelShader)
{
const args = {
renderWidth: surfaceWidth,
renderHeight: surfaceHeight,
fragmentBuffer: Rngon.internalState.fragmentBuffer.data,
pixelBuffer: Rngon.internalState.pixelBuffer.data,
ngonCache: Rngon.internalState.ngonCache.ngons,
cameraPosition: options.cameraPosition,
};
const paramNamesString = `{${Object.keys(args).join(",")}}`;
switch (typeof Rngon.internalState.pixel_shader)
{
case "function":
{
Rngon.internalState.pixel_shader(args);
break;
}
// Shader functions as strings are supported to allow shaders to be
// used in Web Workers. These strings are expected to be of - or
// equivalent to - the form "(a)=>{console.log(a)}".
case "string":
{
Function(paramNamesString, `(${Rngon.internalState.pixel_shader})(${paramNamesString})`)(args);
break;
}
default:
{
Rngon.throw("Unrecognized type of pixel shader function.");
break;
}
}
}
if (!renderOffscreen)
{
renderContext.putImageData(Rngon.internalState.pixelBuffer, 0, 0);
}
}
},
// Returns true if any horizontal part of the surface's DOM canvas is within
// the page's visible region.
is_in_view: function()
{
// Offscreen rendering is always 'in view' in the sense that it doesn't
// have a physical manifestation in the DOM that could go out of view to
// begin with. Technically this could maybe be made to return false to
// indicate that the offscreen buffer is for some reason uinavailable,
// but for now we don't do that.
if (renderOffscreen)
{
return true;
}
const viewHeight = window.innerHeight;
const containerRect = canvasElement.getBoundingClientRect();
return Boolean((containerRect.top > -containerRect.height) &&
(containerRect.top < viewHeight));
},
});
return publicInterface;
// Initializes the internal render buffers if they're not already in a
// suitable state.
function initialize_internal_surface_state(surfaceWidth, surfaceHeight)
{
if ((Rngon.internalState.pixelBuffer.width != surfaceWidth) ||
(Rngon.internalState.pixelBuffer.height != surfaceHeight))
{
Rngon.internalState.pixelBuffer = new ImageData(surfaceWidth, surfaceHeight);
}
if ( Rngon.internalState.usePixelShader &&
(Rngon.internalState.fragmentBuffer.width != surfaceWidth) ||
(Rngon.internalState.fragmentBuffer.height != surfaceHeight))
{
Rngon.internalState.fragmentBuffer.width = surfaceWidth;
Rngon.internalState.fragmentBuffer.height = surfaceHeight;
Rngon.internalState.fragmentBuffer.data = new Array(surfaceWidth * surfaceHeight)
.fill()
.map(e=>({}));
}
if ( Rngon.internalState.useDepthBuffer &&
(Rngon.internalState.depthBuffer.width != surfaceWidth) ||
(Rngon.internalState.depthBuffer.height != surfaceHeight) ||
!Rngon.internalState.depthBuffer.data.length)
{
Rngon.internalState.depthBuffer.width = surfaceWidth;
Rngon.internalState.depthBuffer.height = surfaceHeight;
Rngon.internalState.depthBuffer.data = new Array(Rngon.internalState.depthBuffer.width *
Rngon.internalState.depthBuffer.height);
}
return;
}
// Initializes the target DOM <canvas> element for rendering into. Throws on errors.
function setup_onscreen(canvasElement, scale)
{
Rngon.assert && (canvasElement instanceof Element)
|| Rngon.throw("Can't find the given canvas element.");
const renderContext = canvasElement.getContext("2d");
Rngon.assert && (renderContext instanceof CanvasRenderingContext2D)
|| Rngon.throw("Couldn't establish a canvas render context.");
// Size the canvas as per the requested render scale.
const surfaceWidth = Rngon.renderable_width_of(canvasElement, scale);
const surfaceHeight = Rngon.renderable_height_of(canvasElement, scale);
{
Rngon.assert && ((surfaceWidth > 0) &&
(surfaceHeight > 0))
|| Rngon.throw("Couldn't retrieve the canvas's dimensions.");
canvasElement.setAttribute("width", surfaceWidth);
canvasElement.setAttribute("height", surfaceHeight);
}
return {
surfaceWidth,
surfaceHeight,
canvasElement,
renderContext};
}
// Sets up rendering into an off-screen buffer, i.e. without using a DOM <canvas>
// element. Right now, since the renderer by default renders into an off-screen
// buffer first and then transfers the pixels onto a <canvas>, this function
// is more about just skipping initialization of the <canvas> element.
//
// Note: This function should throw on errors.
function setup_offscreen(width, height)
{
return {
surfaceWidth: width,
surfaceHeight: height,
};
}
}
// Resets the surface's render buffers to their initial contents.
Rngon.surface.wipe = function()
{
Rngon.internalState.pixelBuffer.data.fill(0);
/// TODO: Wipe the fragment buffer.
if (Rngon.internalState.useDepthBuffer)
{
Rngon.internalState.depthBuffer.data.fill(Rngon.internalState.depthBuffer.clearValue);
}
return;
}
/*
* Most recent known filename: js/rallysported.js
*
* Tarpeeksi Hyvae Soft 2018 /
* RallySportED-js
*
*/
"use strict";
// Top-level namespace for RallySportED.
const Rsed = {};
// Various small utility functions and the like.
{
// For inline assertions, e.g.:
//
//   Rsed.assert && (x === 1)
//               || Rsed.throw("X wasn't 1.").
//
// Note that setting this to 'false' won't disable assertions - for that,
// you'll want to search/replace "Rsed.assert &&" with "Rsed.assert ||"
// and keep this set to 'true'.
Object.defineProperty(Rsed, "assert", {value:true, writable:false});
// Generates a version 4 UUID and returns it as a string. Adapted with
// superficial modifications from https://stackoverflow.com/a/2117523,
// which is based on https://gist.github.com/jed/982883.
Rsed.generate_uuid4_string = ()=>
{
return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c=>(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
Rsed.throw = (fatalErrorMessage = "")=>
{
if (Rsed && Rsed.core)
{
Rsed.core.panic(fatalErrorMessage);
}
else
{
Rsed.ui.popup_notification(`${fatalErrorMessage}`, {
notificationType: "fatal",
timeoutMs: 0,
});
}
throw new Error("RallySportED error: " + fatalErrorMessage);
}
Rsed.alert = (message = "")=>
{
console.warn("RallySportED: " + message);
Rsed.ui.popup_notification(message);
}
Rsed.log = (message = "")=>
{
console.log("RallySportED: " + message);
}
Rsed.throw_if = (condition, messageIfTrue)=>
{
if (condition)
{
Rsed.throw(messageIfTrue)
}
}
Rsed.throw_if_undefined = (...properties)=>
{
for (const property of properties)
{
if (typeof property === "undefined")
{
Rsed.throw("A required property is undefined.");
}
}
return;
}
Rsed.throw_if_not_type = (typeName, ...properties)=>
{
for (const property of properties)
{
const isOfType = (()=>
{
switch (typeName)
{
case "array": return Array.isArray(property);
default: return (typeof property === typeName);
}
})();
if (!isOfType)
{
Rsed.throw(`A property is of the wrong type; expected "${typeName}".`);
}
}
return;
}
Rsed.lerp = (x = 0, y = 0, interval = 0)=>(x + (interval * (y - x)));
Rsed.clamp = (value = 0, min = 0, max = 1)=>Math.min(Math.max(value, min), max);
}
/*
* Most recent known filename: js/ui/ui.js
*
* Tarpeeksi Hyvae Soft 2019 /
* RallySportED-js
*
*/
"use strict";
Rsed.ui = {};
/*
* Most recent known filename: js/ui/notification.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
// Opens a self-closing popup notification in RallySportED's DOM.
Rsed.ui.popup_notification = function(string = "", args = {})
{
Rsed.throw_if_not_type("string", string);
Rsed.throw_if_not_type("object", args);
args =
{
...{
notificationType: "warning", // | "info" | "error" | "fatal"
timeoutMs: 6000,
},
...args
}
Rsed.throw_if_not_type("number", args.timeoutMs);
Rsed.throw_if_not_type("string", args.notificationType);
const faIcon = (()=>
{
const meta = "fa-fw";
switch (args.notificationType)
{
case "info": return `${meta} fas fa-info`;
case "warning": return `${meta} fas fa-toilet-paper-slash`;
case "error": return `${meta} fas fa-spider`;
case "fatal": return `${meta} fas fa-otter`;
default: return `${meta} fas far fa-comment`;
}
})();
// Spacing (in pixels) between two adjacent popup elements.
const popupVerticalSpacing = 1;
const popupElement = document.createElement("div");
const iconElement = document.createElement("i");
const textContainer = document.createElement("div");
iconElement.classList.add(...(`icon-element ${faIcon}`.split(" ")));
textContainer.classList.add("text-container");
popupElement.classList.add("popup-notification", "transitioning-in", args.notificationType);
textContainer.innerHTML = string;
popupElement.appendChild(iconElement);
popupElement.appendChild(textContainer);
popupElement.onclick = close_popup;
const container = document.getElementById("popup-notifications-container");
container.appendChild(popupElement);
update_vertical_positions();
append_transition_in();
const removalTimer = (args.timeoutMs <= 0)
? false
: setTimeout(close_popup, args.timeoutMs);
const publicInterface = Object.freeze({
close: ()=>close_popup(true),
});
return publicInterface;
function close_popup(initiatedByUser = false)
{
if (initiatedByUser &&
popupElement.classList.contains("transitioning-in"))
{
return;
}
clearTimeout(removalTimer);
const fadeout = popupElement.animate([
{transform: "rotateX(90deg)", opacity: "0"}
], {duration: 200, easing: "ease-in-out"});
fadeout.onfinish = ()=>{
popupElement.remove();
update_vertical_positions();
}
return;
}
// Adds a transitioning animation to the popup. Assumes that the popup element
// has just been added to the DOM and has an opacity of 0.
function append_transition_in()
{
setTimeout(()=>popupElement.classList.remove("transitioning-in"), 0);
return;
}
// Arrange the currently open popups vertically bottom to top from newest to
// oldest. (The first popup node is expected to be the oldest.)
function update_vertical_positions()
{
const popups = Array.from(container.children).filter(p=>p.classList.contains("popup-notification"));
if (!popups.length) {
return;
}
let totalHeight = popups.reduce((totalHeight, popup)=>{
return (totalHeight + popup.offsetHeight + popupVerticalSpacing);
}, 0);
for (const popup of popups) {
popup.style.bottom = `${totalHeight -= (popup.offsetHeight + popupVerticalSpacing)}px`;
}
}
}
/*
* Most recent known filename: js/misc/browser-metadata.js
*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// Rudimentary (and not necessarily accurate) information about the browser in which
// the app is running.
Rsed.browserMetadata = (function()
{
const publicInterface = {
isMobile: Boolean(/android|mobi|(crios\/)/i.test(navigator.userAgent)),
browserName: (/Chrome/i.test(navigator.userAgent)? "Chrome" :
/CriOS/i.test(navigator.userAgent)? "Chrome" :
/Opera/i.test(navigator.userAgent)? "Opera" :
/Firefox/i.test(navigator.userAgent)? "Firefox" :
/Safari/i.test(navigator.userAgent)? "Safari" :
null),
};
return publicInterface;
})();
"use strict";
Rsed.uuid = {};
// Generates a version 4 UUID and returns it as a string. Adapted with
// superficial modifications from https://stackoverflow.com/a/2117523,
// which is based on https://gist.github.com/jed/982883.
Rsed.uuid.generate_v4 = function()
{
return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c=>(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
/*
* 2019, 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
{ // A block to limit the scope of the unit-global variables we set up, below.
// We'll sort the n-gon's vertices into those on its left side and those on its
// right side.
const leftVerts = new Array(500);
const rightVerts = new Array(500);
// Then we'll organize the sorted vertices into edges (lines between given two
// vertices). Once we've got the edges figured out, we can render the n-gon by filling
// in the spans between its edges.
const leftEdges = new Array(500).fill().map(e=>({}));
const rightEdges = new Array(500).fill().map(e=>({}));
let numLeftVerts = 0;
let numRightVerts = 0;
let numLeftEdges = 0;
let numRightEdges = 0;
// A stripped-down version of the retro n-gon renderer's polygon filler. Includes
// only the features required by RallySportED-js, helping to boost FPS.
//
// For the original function, see Rngon.ngon_filler().
//
// Note: Consider this the inner render loop; it may contain ugly things like
// code repetition for the benefit of performance. If you'd like to refactor the
// code, please benchmark its effects on performance first - maintaining or
// improving performance would be great, losing performance would be bad.
//
Rsed.minimal_rngon_filler = function(auxiliaryBuffers = [])
{
const pixelBuffer = Rngon.internalState.pixelBuffer.data;
const renderWidth = Rngon.internalState.pixelBuffer.width;
const renderHeight = Rngon.internalState.pixelBuffer.height;
const vertexSorters =
{
verticalAscending: (vertA, vertB)=>((vertA.y === vertB.y)? 0 : ((vertA.y < vertB.y)? -1 : 1)),
verticalDescending: (vertA, vertB)=>((vertA.y === vertB.y)? 0 : ((vertA.y > vertB.y)? -1 : 1))
}
// Rasterize the n-gons.
for (let n = 0; n < Rngon.internalState.ngonCache.count; n++)
{
const ngon = Rngon.internalState.ngonCache.ngons[n];
const material = ngon.material;
const texture = ngon.material.texture;
Rngon.assert && (ngon.vertices.length < leftVerts.length)
|| Rngon.throw("Overflowing the vertex buffer");
numLeftVerts = 0;
numRightVerts = 0;
numLeftEdges = 0;
numRightEdges = 0;
// In theory, we should never receive n-gons that have no vertices, but let's check
// to make sure.
if (ngon.vertices.length <= 0)
{
continue;
}
// Rasterize a line.
if (ngon.vertices.length === 2)
{
Rngon.line_draw(ngon.vertices[0], ngon.vertices[1], material.color, n, false);
continue;
}
// Rasterize a polygon with 3 or more vertices.
else
{
// Figure out which of the n-gon's vertices are on its left side and which on the
// right. The vertices on both sides will be arranged from smallest Y to largest
// Y, i.e. top-to-bottom in screen space. The top-most vertex and the bottom-most
// vertex will be shared between the two sides.
{
// Generic algorithm for n-sided convex polygons.
{
// Sort the vertices by height from smallest Y to largest Y.
ngon.vertices.sort(vertexSorters.verticalAscending);
const topVert = ngon.vertices[0];
const bottomVert = ngon.vertices[ngon.vertices.length-1];
leftVerts[numLeftVerts++] = topVert;
rightVerts[numRightVerts++] = topVert;
// Trace a line along XY between the top-most vertex and the bottom-most vertex;
// and for the intervening vertices, find whether they're to the left or right of
// that line on X. Being on the left means the vertex is on the n-gon's left side,
// otherwise it's on the right side.
for (let i = 1; i < (ngon.vertices.length - 1); i++)
{
const lr = Rngon.lerp(topVert.x, bottomVert.x, ((ngon.vertices[i].y - topVert.y) / (bottomVert.y - topVert.y)));
if (ngon.vertices[i].x >= lr)
{
rightVerts[numRightVerts++] = ngon.vertices[i];
}
else
{
leftVerts[numLeftVerts++] = ngon.vertices[i];
}
}
leftVerts[numLeftVerts++] = bottomVert;
rightVerts[numRightVerts++] = bottomVert;
}
}
// Create edges out of the vertices.
{
for (let l = 1; l < numLeftVerts; l++) add_edge(leftVerts[l-1], leftVerts[l], true);
for (let r = 1; r < numRightVerts; r++) add_edge(rightVerts[r-1], rightVerts[r], false);
function add_edge(vert1, vert2, isLeftEdge)
{
const startY = Math.round(vert1.y);
const endY = Math.round(vert2.y);
const edgeHeight = (endY - startY);
// Ignore horizontal edges.
if (edgeHeight === 0) return;
const startX = Math.round(vert1.x);
const endX = Math.ceil(vert2.x);
const deltaX = ((endX - startX) / edgeHeight);
const edge = (isLeftEdge? leftEdges[numLeftEdges++] : rightEdges[numRightEdges++]);
edge.startY = startY;
edge.endY = endY;
edge.startX = startX;
edge.deltaX = deltaX;
}
}
// Draw the n-gon. On each horizontal raster line, there will be two edges: left and right.
// We'll render into the pixel buffer each horizontal span that runs between the two edges.
if (material.hasFill)
{
let curLeftEdgeIdx = 0;
let curRightEdgeIdx = 0;
let leftEdge = leftEdges[curLeftEdgeIdx];
let rightEdge = rightEdges[curRightEdgeIdx];
if (!numLeftEdges || !numRightEdges) continue;
// Note: We assume the n-gon's vertices to be sorted by increasing Y.
const ngonStartY = leftEdges[0].startY;
const ngonEndY = leftEdges[numLeftEdges-1].endY;
const ngonHeight = (ngonEndY - ngonStartY);
// Rasterize the n-gon in horizontal pixel spans over its height.
for (let y = ngonStartY; y < ngonEndY; y++)
{
const spanStartX = Math.round(leftEdge.startX);
const spanEndX = Math.round(rightEdge.startX);
const spanWidth = ((spanEndX - spanStartX) + 1);
if ((spanWidth > 0) &&
(y >= 0) &&
(y < renderHeight))
{
// Assumes the pixel buffer consists of 4 elements per pixel (e.g. RGBA).
let pixelBufferIdx = (((spanStartX + y * renderWidth) * 4) - 4);
// Draw a solid-filled span.
if (!texture)
{
for (let x = spanStartX; x < spanEndX; x++)
{
pixelBufferIdx += 4;
// Bounds-check, since we don't clip vertices to the viewport.
if (x < 0) continue;
if (x >= renderWidth) break;
pixelBuffer[pixelBufferIdx + 0] = material.color.red;
pixelBuffer[pixelBufferIdx + 1] = material.color.green;
pixelBuffer[pixelBufferIdx + 2] = material.color.blue;
pixelBuffer[pixelBufferIdx + 3] = (material.auxiliary.isCorner? 100 : 255);
for (let b = 0; b < auxiliaryBuffers.length; b++)
{
if (material.auxiliary[auxiliaryBuffers[b].property] !== null)
{
// Buffers are expected to consist of one element per pixel.
auxiliaryBuffers[b].buffer[pixelBufferIdx/4] = material.auxiliary[auxiliaryBuffers[b].property];
}
}
}
}
// Draw a textured span.
else
{
const wDiv = (texture.width / spanWidth);
const hDiv = (texture.height / ngonHeight);
for (let x = spanStartX; x < spanEndX; x++)
{
// Update values that're interpolated horizontally along the span.
pixelBufferIdx += 4;
// Bounds-check, since we don't clip vertices to the viewport.
if (x < 0) continue;
if (x >= renderWidth) break;
// Will hold the texture coordinates used if we end up drawing
// a textured pixel at the current x,y screen location.
let u = 0.0, v = 0.0;
// Screen-space UV mapping, as used e.g. in the DOS game Rally-Sport.
{
// Pixel coordinates relative to the polygon.
const ngonX = (x - spanStartX + 1);
const ngonY = (y - ngonStartY + 1);
u = (ngonX * wDiv);
v = (ngonY * hDiv);
// The texture image is flipped, so we need to flip V as well.
v = (texture.height - v);
}
const texel = texture.pixels[(~~u) + (~~v) * texture.width];
// Make sure we gracefully exit if accessing the texture out of bounds.
if (!texel) continue;
// Alpha-test the texture. If the texel isn't fully opaque, skip it.
if (texel.alpha !== 255) continue;
// The pixel passed its alpha test, depth test, etc., and should be drawn
// on screen.
{
pixelBuffer[pixelBufferIdx + 0] = (texel.red   * material.color.unitRange.red);
pixelBuffer[pixelBufferIdx + 1] = (texel.green * material.color.unitRange.green);
pixelBuffer[pixelBufferIdx + 2] = (texel.blue  * material.color.unitRange.blue);
pixelBuffer[pixelBufferIdx + 3] = (material.auxiliary.isCorner? 100 : 255);
for (let b = 0; b < auxiliaryBuffers.length; b++)
{
if (material.auxiliary[auxiliaryBuffers[b].property] !== null)
{
// Buffers are expected to consist of one element per pixel.
auxiliaryBuffers[b].buffer[pixelBufferIdx/4] = material.auxiliary[auxiliaryBuffers[b].property];
}
}
}
}
}
}
// Update values that're interpolated vertically along the edges.
leftEdge.startX  += leftEdge.deltaX;
rightEdge.startX += rightEdge.deltaX;
// We can move onto the next edge when we're at the end of the current one.
if (y === (leftEdge.endY - 1)) leftEdge = leftEdges[++curLeftEdgeIdx];
if (y === (rightEdge.endY - 1)) rightEdge = rightEdges[++curRightEdgeIdx];
}
}
// Draw a wireframe around any n-gons that wish for one.
if (Rngon.internalState.showGlobalWireframe ||
material.hasWireframe)
{
for (let l = 1; l < numLeftVerts; l++)
{
Rngon.line_draw(leftVerts[l-1], leftVerts[l], material.wireframeColor, n);
}
for (let r = 1; r < numRightVerts; r++)
{
Rngon.line_draw(rightVerts[r-1], rightVerts[r], material.wireframeColor, n);
}
}
}
}
return;
}
}
/*
* 2019, 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// A stripped-down version of the retro n-gon renderer's polygon transformer. Includes
// only the features required by RallySportED-js, helping to boost FPS.
//
// Expects vertices to already be in screen space.
//
// For the original function, see Rngon.ngon_transform_and_light().
Rsed.minimal_rngon_tcl = function(ngons = [])
{
const ngonCache = Rngon.internalState.ngonCache;
const renderWidth = Rngon.internalState.pixelBuffer.width;
const renderHeight = Rngon.internalState.pixelBuffer.height;
for (const ngon of ngons)
{
// Ignore n-gons that would be fully outside of the screen.
{
const boundingBox = ngon.vertices.reduce((bounds, v)=>{
if (bounds.xMin > v.x) bounds.xMin = v.x;
if (bounds.xMax < v.x) bounds.xMax = v.x;
if (bounds.yMin > v.y) bounds.yMin = v.y;
if (bounds.yMax < v.y) bounds.yMax = v.y;
return bounds;
}, {xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity});
if ((boundingBox.xMin >= renderWidth) || (boundingBox.xMax < 0) ||
(boundingBox.yMin >= renderHeight) || (boundingBox.yMax < 0))
{
continue;
}
}
// Ignore fully transparent n-gons.
if (!ngon.material.color.alpha &&
!ngon.material.hasWireframe)
{
continue;
}
// Copy the ngon into the internal n-gon cache, so we can operate on it without
// mutating the original n-gon's data.
const cachedNgon = ngonCache.ngons[ngonCache.count++];
{
cachedNgon.vertices.length = 0;
for (let v = 0; v < ngon.vertices.length; v++)
{
cachedNgon.vertices[v] = Rngon.vertex(ngon.vertices[v].x,
ngon.vertices[v].y,
ngon.vertices[v].z);
}
cachedNgon.material = ngon.material;
cachedNgon.isActive = true;
}
};
// Mark as inactive any cached n-gons that we didn't touch, so the renderer knows
// to ignore them for the current frame.
for (let i = ngonCache.count; i < ngonCache.ngons.length; i++)
{
ngonCache.ngons[i].isActive = false;
}
return;
}
/*
* Most recent known filename: js/player/player.js
*
* 2021 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
Rsed.player = (function()
{
let isPlayerStarting = false;
let isPlaying = false;
let jsDosController = null;
const playerContainer = document.getElementById("jsdos-container");
const playerCanvas = document.getElementById("jsdos-canvas");
const stopButton = document.getElementById("stop-jsbox-button");
Rsed.assert && (playerCanvas &&
playerContainer &&
stopButton)
|| Rsed.throw("Malformed DOM for the player elements.");
const publicInterface = {
is_playing: function()
{
return isPlaying;
},
stop: stop_jsbox,
play: async function(withAI = false)
{
if (!(await start_jsbox(withAI)))
{
stop_jsbox();
}
},
};
return publicInterface;
function stop_jsbox()
{
if (jsDosController)
{
jsDosController.exit();
}
jsDosController = null;
isPlayerStarting = false;
isPlaying = false;
playerCanvas.getContext("2d").clearRect(0, 0, playerCanvas.width, playerCanvas.height);
playerContainer.style.display = "none";
Rsed.ui.htmlUI.refresh();
return;
}
async function start_jsbox(playWithAI = false)
{
// Don't allow more than one instance of the player.
if (isPlayerStarting ||
jsDosController)
{
return;
}
isPlayerStarting = true;
stopButton.style.display = "none";
playerContainer.style.display = "initial";
const gameZip = await create_zip_for_jsbox();
if (!gameZip)
{
Rsed.ui.popup_notification("Couldn't start the DOSBox player.", {
notificationType: "error",
});
return false;
}
const options = {
wdosboxUrl: "./js-dos/wdosbox.js",
onerror: (error)=>{
window.alert(error);
stop_jsbox();
},
};
Dos(playerCanvas, options)
.ready(function (fileSystem, main) {
fileSystem.extract(URL.createObjectURL(gameZip))
.then(()=>{
main(["-conf", "rsed.conf",
"-c", "mixer master 17:17",
"-c", `bitset game.dta 35 ${playWithAI? 0 : 32}`, // Refer to https://github.com/leikareipa/rallysported/blob/master/docs/rs-formats.txt on GAME.DTA's bytes.
"-c", `bitset rallye.exe 82253 ${playWithAI? 224 : 69}`, // Make the starting lights go out faster if not playing with AI.
"-c", `rload ${Rsed.core.current_project().name}`])
.then((interface)=>{
jsDosController = interface;
isPlaying = true;
stopButton.style.display = "initial";
/// Kludge to detect DOSBox returning to the command prompt, i.e. the
/// user exiting the game.
const stdoutBuffer = [];
jsDosController.listenStdout((chr)=>{
if (stdoutBuffer.push(chr) > 4)
{
stdoutBuffer.shift();
}
if (stdoutBuffer.join("") == "C:\\>")
{
stop_jsbox();
}
});
});
});
});
return true;
}
async function create_zip_for_jsbox()
{
const zip = new JSZip();
const baseArchive = await fetch("./js-dos/data/rallys-rsed.zip");
if (!baseArchive.ok)
{
return false;
}
await zip.loadAsync(baseArchive.blob());
await Rsed.core.current_project().insert_project_data_into_zip(zip);
return await zip.generateAsync({
type: "blob",
compression: "DEFLATE",
compressionOptions: {
level: 1,
},
});
}
})();
/*
* Most recent known filename: js/project/project.js
*
* 2018-2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
// A RallySportED project is a collection of assets for a particular Rally-Sport track that
// the user can modify using RallySportED. Namely, the project consists of two files: the
// .DTA file (also called the "container"), and the .$FT file (also called the "manifesto").
// The .DTA file is a binary file containing the track's individual assets; like heightmap,
// tilemap, textures, etc. The .$FT file consists of an ASCII string providing commands
// to RallySportED on how to modify certain hard-coded track parameters in Rally-Sport for
// that particular track (e.g. the positioning of certain track-side objects, etc.).
Rsed.project = async function(projectArgs = {})
{
// Which of the eight tracks in Rally-Sport's demo version this project is for.
let trackId = null;
// Which of Rally-Sport's two PALAT files this track uses.
let palatId = null;
// Which RallySportED loader is required to load this track.
let loaderVersion = null;
const isPlaceholder = false;
// The height of water tiles on the current track.
let waterLevel = 0;
// Rally-Sport uses checkpoints - invisible markers at given x,y tile positions on the
// track - to keep track of whether the player's car has raced a valid lap. In other
// words, the car must pass through all of the track's checkpoints in order for the lap
// to count. The demo version of Rally-Sport - which is what RallySportED targets - makes
// use of only one checkpoint per track (in addition to the finish line).
const trackCheckpoints = [];
// Load the project's data. After this, projectData.container is expected to hold the
// contents of the .DTA file as a Base64-encoded string; and projectData.manifesto the
// contents of the .$FT file as a plain string.
const projectData = await fetch_project_data();
Rsed.assert && ((typeof projectData.container !== "undefined") &&
(typeof projectData.manifesto !== "undefined") &&
(typeof projectData.meta !== "undefined") &&
(typeof projectData.meta.internalName !== "undefined") &&
(typeof projectData.meta.displayName !== "undefined"))
|| Rsed.throw("Missing required project data.");
Rsed.assert && is_valid_project_name(projectData.meta.internalName)
|| Rsed.throw(`Invalid project base name "${projectData.meta.internalName}".`);
Rsed.assert && ((projectData.meta.width > 0) &&
(projectData.meta.height > 0) &&
(projectData.meta.width === projectData.meta.height))
|| Rsed.throw("Invalid track dimensions for a project.");
// Provides the (Base64-decoded) data of the container file; and metadata about the file,
// like the sizes and byte offsets of the individual asset data segments inside the file.
// Note: The variable names here reflect the names of Rally-Sport's data files. For more
// information, check out RallySportED's documentation on Rally-Sport's data formats at
// https://github.com/leikareipa/rallysported/tree/master/docs.
//
// In brief,
//
//     maasto: track heightmap
//     varimaa: track tilemap
//     palat: track tile textures
//     anims: animation frame textures
//     text: track prop textures
//
const projectDataContainer = Object.freeze(
{
dataBuffer: (()=>
{
const containerDecoded = atob(projectData.container);
const buffer = new ArrayBuffer(containerDecoded.length);
const view = new Uint8Array(buffer);
for (let i = 0; i < containerDecoded.length; i++)
{
view[i] = containerDecoded.charCodeAt(i);
};
return buffer;
})(),
byteSize: function()
{
const maasto  = (new DataView(this.dataBuffer, 0, 4)).getUint32(0, true);
const varimaa = (new DataView(this.dataBuffer, (maasto + 4), 4)).getUint32(0, true);
const palat   = (new DataView(this.dataBuffer, (maasto + varimaa + 8), 4)).getUint32(0, true);
const anims   = (new DataView(this.dataBuffer, (maasto + varimaa + palat + 12), 4)).getUint32(0, true);
const text    = (new DataView(this.dataBuffer, (maasto + varimaa + palat + anims + 16), 4)).getUint32(0, true);
const kierros = (new DataView(this.dataBuffer, (maasto + varimaa + palat + anims + text + 20), 4)).getUint32(0, true);
return Object.freeze({maasto, varimaa, palat, anims, text, kierros});
},
byteOffset: function()
{
const byteSize = this.byteSize();
// The variable names here reflect the names of Rally-Sport's data files.
const maasto  = 4;
const varimaa = (maasto  + byteSize.maasto  + 4);
const palat   = (varimaa + byteSize.varimaa + 4);
const anims   = (palat   + byteSize.palat   + 4);
const text    = (anims   + byteSize.anims   + 4);
const kierros = (text    + byteSize.text    + 4);
return Object.freeze({maasto, varimaa, palat, anims, text, kierros});
},
});
// Pass relevant segments of the container's data into objects responsible for managing
// the corresponding individual assets. Note that the data are passed by reference, so
// modifications made by the objects to the data will be reflected in the container.
const maasto = Rsed.track.maasto(projectData.meta.width, projectData.meta.height,
new Uint8Array(projectDataContainer.dataBuffer,
projectDataContainer.byteOffset().maasto,
projectDataContainer.byteSize().maasto));
const varimaa = Rsed.track.varimaa(projectData.meta.width, projectData.meta.height,
new Uint8Array(projectDataContainer.dataBuffer,
projectDataContainer.byteOffset().varimaa,
projectDataContainer.byteSize().varimaa));
const palat = Rsed.track.palat(Rsed.constants.palaWidth, Rsed.constants.palaHeight,
new Uint8Array(projectDataContainer.dataBuffer,
projectDataContainer.byteOffset().palat,
projectDataContainer.byteSize().palat));
const props = await Rsed.track.props(new Uint8Array(projectDataContainer.dataBuffer,
projectDataContainer.byteOffset().text,
projectDataContainer.byteSize().text));
const kierros = await Rsed.track.kierros(new Uint8Array(projectDataContainer.dataBuffer,
projectDataContainer.byteOffset().kierros,
projectDataContainer.byteSize().kierros));
const manifesto = projectData.manifesto;
apply_manifesto();
Rsed.log("\"" + projectData.meta.displayName + "\" is a valid RallySportED project. " +
"Its internal name is \"" + projectData.meta.internalName + "\".");
const publicInterface = Object.freeze(
{
isPlaceholder: false,
kierros,
maasto,
varimaa,
palat,
props,
manifesto,
trackId,
palatId,
loaderVersion,
waterLevel,
get name()
{
const name = projectData.meta.internalName.toLowerCase();
const capitalizedName = (name[0].toUpperCase() +
name.slice(1));
return capitalizedName;
},
get internalName()
{
return this.name;
},
get areAllChangesSaved()
{
return Rsed.ui.undoStack.is_current_undo_level_saved();
},
rename: function(newName = undefined)
{
if (typeof newName !== "string")
{
if (!(newName = window.prompt("Enter a new name for this track", this.internalName)))
{
return;
}
}
newName = newName.toLowerCase();
if (!is_valid_project_name(newName))
{
Rsed.ui.popup_notification("A track's name must be 1-8 characters from A-Z.", {
notificationType: "error",
});
return;
}
Rsed.log(`Renaming project ${this.name} to ${newName}`);
projectData.meta.displayName = projectData.meta.internalName = newName;
Rsed.ui.htmlUI.refresh();
},
track_id: function()
{
Rsed.assert && (trackId !== null)
|| Rsed.throw("Attempting to access a project's track id before it has been set.");
return trackId;
},
track_checkpoint: function()
{
return (trackCheckpoints[0] || {x:0,y:0});
},
// Returns the project's current data as a JSON string in RallySportED-js's
// JSON track format.
json: function()
{
// Encode the container's data in Base64.
const view = new Uint8Array(projectDataContainer.dataBuffer);
const string = view.reduce((data, byte)=>(data + String.fromCharCode(byte)), "");
const containerInBase64 = btoa(string);
return JSON.stringify({
container: containerInBase64,
manifesto: updated_manifesto_string(),
meta: {
internalName: this.internalName,
displayName: this.name,
width: this.maasto.width,
height: this.maasto.height,
},
});
},
// Appends this project's data files into the given JSZip zip file object.
insert_project_data_into_zip: async function(zip)
{
const projectNameInZip = this.internalName.toUpperCase();
// The default HITABLE.TXT file (which holds Rally-Sport's top lap times) is
// stored locally in a zip file. We'll need to deflate its data into an array.
const hitable = await (async()=>
{
const zipFile = await (new JSZip()).loadAsync(Rsed.project.hitableZip);
const hitableFile = zipFile.files["HITABLE.TXT"];
return (hitableFile? hitableFile.async("arraybuffer") : null);
})();
if (!hitable)
{
Rsed.ui.popup_notification("Couldn't find the HITABLE.TXT file.", {
notificationType: "error",
});
return false;
}
zip.file(`${projectNameInZip}/${projectNameInZip}.DTA`, projectDataContainer.dataBuffer);
zip.file(`${projectNameInZip}/${projectNameInZip}.$FT`, updated_manifesto_string());
zip.file(`${projectNameInZip}/HITABLE.TXT`, hitable);
return true;
},
// Returns a promise that resolves with the project's current data as a JSZip zip
// blob. In case of error, the promise rejects with an error string (and/or whatever
// JSZip rejects with).
zip: async function(compressionLevel = 1)
{
const zip = new JSZip();
if (!await this.insert_project_data_into_zip(zip))
{
return false;
}
return zip.generateAsync({
type: "blob",
compression: "DEFLATE",
compressionOptions: {
level: compressionLevel,
},
});
},
// Initiates a browser download of the project's current data as a ZIP file.
download_as_zip: async function()
{
const filename = `${this.internalName.toUpperCase()}.ZIP`;
Rsed.log(`Saving project "${projectData.meta.displayName}" into ${filename}.`);
let saved = false;
// In case something goes wrong and an error gets thrown in some function while saving,
// we want to catch it here rather than letting the entire app go down, so as to give
// the user a chance to re-try.
try
{
const zipBlob = await this.zip();
saveAs(zipBlob, filename); // From FileSaver.js.
saved = true;
}
catch (error)
{
Rsed.ui.popup_notification(`Failed to save the project: ${error}`, {
notificationType: "error",
});
saved = false;
}
if (saved)
{
// Let the user know there are no unsaved changes anymore.
Rsed.ui.undoStack.mark_current_undo_level_as_saved();
Rsed.ui.htmlUI.refresh();
}
return;
}
});
return publicInterface;
// Returns an updated version of the project's manifesto string, reflecting the project's
// current status - e.g. positions of track props, which may have been moved by the user
// since the project was loaded in. The original manifesto string is not changed.
function updated_manifesto_string()
{
const requiredLoaderVersion = 5;
const manifesto = projectData.manifesto.split("\n").filter(line=>line.trim().length);
// We'll append the new manifesto string here.
let updatedManifesto = `0 ${trackId + 1} ${palatId + 1} ${requiredLoaderVersion}\n`;
// Any manifesto commands we won't update will be copied verbatim into the updated
// version.
for (let i = 0; i < (manifesto.length - 1); i++)
{
const command = Number(manifesto[i].split(" ").shift());
switch (command)
{
// These are the commands we want to update, so we don't copy them.
case 0:
case 2:
case 3:
case 4:
case 5: break;
// These are the commands we won't update, so we just copy then.
default: updatedManifesto += (manifesto[i] + "\n");
}
}
// Update the various commands according to the current values of their related data.
{
const trackProps = props.locations_of_props_on_track(trackId);
// Command #2 for the number of props.
{
updatedManifesto += ("2 " + trackProps.length + "\n");
}
// Command #3 to create and position the track's props.
{
for (let i = 0; i < trackProps.length; i++)
{
const globalX = Math.floor((trackProps[i].x / Rsed.constants.groundTileSize) / 2);
const globalZ = Math.floor((trackProps[i].z / Rsed.constants.groundTileSize) / 2);
const localX = Math.floor((((trackProps[i].x / Rsed.constants.groundTileSize) / 2) - globalX) * 256);
const localZ = Math.floor((((trackProps[i].z / Rsed.constants.groundTileSize) / 2) - globalZ) * 256);
updatedManifesto += `3 ${trackProps[i].propId + 1} ${globalX} ${globalZ} ${localX} ${localZ}\n`;
}
}
}
updatedManifesto += "99\n";
return updatedManifesto;
}
// Returns true if the given string is a valid RallySportED-js project name.
function is_valid_project_name(name)
{
return ((typeof name == "string") &&
(name.length >= 1) &&
(name.length <= 8) &&
/^[a-zA-Z]+$/.test(name));
}
// Returns the data (container file, manifesto file, and certain metadata) of the
// given project as an object formatted like so:
//
//    {
//        container: "the contents of the project's binary container file as a Base64-encoded string",
//        manifesto: "the contents of the prjoect's textual manifesto file as a string",
//        meta:
//        {
//            // Metadata about the project; like its name, and the dimensions of its track.
//        }
//    }
//
async function fetch_project_data()
{
Rsed.throw_if_undefined(projectArgs.dataLocality);
const projectData = await (async()=>
{
switch (projectArgs.dataLocality)
{
case "server-rsc": return (await fetch_project_data_from_rsc_server())[0];
case "server-rsed": return (await fetch_project_data_from_rsed_server())[0];
case "client": return await load_project_data_from_zip_file();
case "inline": return Promise.resolve(projectArgs.data);
default: Rsed.throw("Unrecognized project data locality."); break;
}
})();
return projectData;
async function load_project_data_from_zip_file()
{
Rsed.throw_if_undefined(projectArgs.contentId);
const zip = await (new JSZip()).loadAsync(projectArgs.contentId);
// The zip file is expected to contain a project's .DTA and .$FT (manifesto) files.
let manifestoFile = null;
let dtaFile = null;
let projectDirName = "undefined";
// Parse the zip file's contents and extract the project's data.
{
const files = Object.values(zip.files).reduce((files, e)=>(e.dir? files : files.concat(e)), []);
Rsed.assert && (files.length === 3)
|| Rsed.throw("The given project zip file is malformed. Please re-export it and try again.");
// File names are expected in the form "XXXX/YYYY.ZZZ", where XXXX is the project
// name.
projectDirName = files[0].name.slice(0, files[0].name.indexOf("/")).toLowerCase();
// Find the project's $FT and DTA files inside the zip file.
{
files.forEach(file=>
{
if (manifestoFile && dtaFile)
{
return;
}
const fileSuffix = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
const fileBasePath = file.name.slice(0, file.name.lastIndexOf(".")).toLowerCase();
const fileBaseName = fileBasePath.slice(fileBasePath.lastIndexOf("/") + 1);
// Each resource file is expected to hold the same name as the project itself.
if (fileBaseName !== projectDirName)
{
return;
}
switch (fileSuffix)
{
case "$ft": manifestoFile = file; break;
case "dta": dtaFile = file; break;
default: break;
}
});
Rsed.assert && (manifestoFile && dtaFile)
|| Rsed.throw("The given project zip file is malformed. Please re-export it and try again.")
}
}
// Create an object containing the project's data.
const projectData = {};
{
projectData.manifesto = await manifestoFile.async("string");
projectData.container = await dtaFile.async("arraybuffer");
// Derive the track's dimensions from the size of the heightmap. (All tracks are assumed
// square).
const trackSideLen = Math.sqrt(new Uint32Array(projectData.container, 0, 1)[0] / 2);
// All tracks in the demo version of Rally-Sport are expected to have either 64 or 128
// tiles per side.
Rsed.assert && ([64, 128].includes(trackSideLen))
|| Rsed.throw("Invalid track dimensions in project file.");
projectData.meta =
{
displayName: projectDirName,
internalName: projectDirName,
width: trackSideLen,
height: trackSideLen,
};
// Encode the .DTA data as Base64.
const view = new Uint8Array(projectData.container);
const string = view.reduce((data, byte)=>(data + String.fromCharCode(byte)), "");
projectData.container = btoa(string);
}
return projectData;
}
// Loads the project's data from the RallySportED-js server. This server
// hosts the original tracks from the Rally-Sport demo.
async function fetch_project_data_from_rsed_server()
{
Rsed.throw_if_undefined(projectArgs.contentId);
const trackName = (()=>
{
switch (projectArgs.contentId)
{
case "demoa": return "demo-1";
case "demob": return "demo-2";
case "democ": return "demo-3";
case "demod": return "demo-4";
case "demoe": return "demo-5";
case "demof": return "demo-6";
case "demog": return "demo-7";
case "demoh": return "demo-8";
default: Rsed.throw("Unknown track name.");
}
})();
const serverResponse = await fetch(`./client/assets/tracks/${trackName}.json`);
if (serverResponse.status !== 200)
{
Rsed.throw("Failed to fetch the requested data from the RallySportED-js server.");
}
try
{
return await serverResponse.json();
}
catch (error)
{
Rsed.throw("Received malformed JSON from the RallySportED-js server.");
}
}
// Loads the project's data from the Rally-Sport Content server. This
// server hosts custom, user-made tracks.
async function fetch_project_data_from_rsc_server()
{
Rsed.throw_if_undefined(projectArgs.contentId);
const serverResponse = await fetch(`${Rsed.constants.rallySportContentURL}/tracks/?id=${projectArgs.contentId}&json=true`);
if (serverResponse.status !== 200)
{
Rsed.throw("Failed to fetch the requested data from the Rally-Sport Content server.");
}
try
{
return await serverResponse.json()
}
catch (error)
{
Rsed.throw("Received malformed JSON from the Rally-Sport Content server.");
}
}
}
function apply_manifesto()
{
let numPropsAdded = 0;
Rsed.assert && (!isPlaceholder)
|| Rsed.throw("Can't apply manifestos to placeholder projects.");
const commands = manifesto.split("\n").filter(line=>line.trim().length);
Rsed.assert && (commands.length >= 2)
|| Rsed.throw("Invalid number of lines in the manifesto.");
Rsed.assert && (commands[0].startsWith("0 "))
|| Rsed.throw("Expected the manifesto to begin with the command 0, but it doesn't.");
Rsed.assert && (commands[commands.length-1].startsWith("99"))
|| Rsed.throw("Expected the manifesto to end with the command 99, but it doesn't.");
commands.forEach(command=>
{
apply_command(command);
});
return;
function apply_command(commandLine)
{
const params = commandLine.split(" ");
const command = Number(params.shift());
eval("apply_" + command)(params);
// Command: REQUIRE. Specifies which of the eight tracks in Rally-Sport's demo the project
// is forked from.
function apply_0(args = [])
{
Rsed.assert && (args.length === 3)
|| Rsed.throw("Invalid number of arguments to manifesto command 0. Expected 4 but received " + args.length + ".");
set_track_id(Math.floor(Number(args[0])) - 1);
set_palat_id(Math.floor(Number(args[1])) - 1);
set_required_loader_version(Number(args[2]));
}
// Command: ROAD. Sets up the game's driving physics for various kinds of road surfaces.
function apply_1(args = [])
{
Rsed.assert && (args.length === 1)
|| Rsed.throw("Invalid number of arguments to manifesto command 1. Expected 1 but received " + args.length + ".");
}
// Command: NUM_OBJS. Sets the number of props (in addition to the starting line) on the track.
function apply_2(args = [])
{
Rsed.assert && (args.length === 1)
|| Rsed.throw("Invalid number of arguments to manifesto command 2. Expected 1 but received " + args.length + ".");
const numObjs = Math.floor(Number(args[0]));
if (loaderVersion < 5)
{
props.set_count(trackId, numObjs);
}
else
{
props.set_count__loader_v5(trackId, numObjs);
}
}
// Command: ADD_OBJ. Adds a new prop to the track.
function apply_3(args = [])
{
Rsed.assert && (args.length === 5)
|| Rsed.throw("Invalid number of arguments to manifesto command 3. Expected 5 but received " + args.length + ".");
const propId = Math.floor(Number(args[0]) - 1);
const x = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
const z = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));
// Prior to loader version 5, command #3 would insert a new prop onto the
// track. Since version 5, command #3 modifies an existing prop, after
// you've first used commad #2 to set the total prop count (which creates
// that many uninitialized props, which command #3 then initializes).
if (loaderVersion < 5)
{
props.add_location(trackId, propId, {x, z});
}
else
{
props.change_prop_type(trackId, numPropsAdded, propId);
props.set_prop_location(trackId, numPropsAdded, {x, z});
numPropsAdded++;
}
}
// Command: CHANGE_OBJ_TYPE. Changes the type of the given prop.
function apply_4(args = [])
{
Rsed.assert && (args.length === 2)
|| Rsed.throw("Invalid number of arguments to manifesto command 4. Expected 2 but received " + args.length + ".");
const targetPropIdx = Math.floor(Number(args[0]) - 1);
const newPropId = Math.floor(Number(args[1]) - 1);
props.change_prop_type(trackId, targetPropIdx, newPropId);
}
// Command: MOVE_OBJ. Moves the position of the given prop.
function apply_5(args = [])
{
Rsed.assert && (args.length === 5)
|| Rsed.throw("Invalid number of arguments to manifesto command 5. Expected 5 but received " + args.length + ".");
const targetPropIdx = Math.floor(Number(args[0]) - 1);
const x = Math.floor(((Number(args[1]) * 2) * Rsed.constants.groundTileSize) + Number(args[3]));
const z = Math.floor(((Number(args[2]) * 2) * Rsed.constants.groundTileSize) + Number(args[4]));
props.set_prop_location(trackId, targetPropIdx, {x, z});
}
// Command: MOVE_STARTING_POS. Moves the starting line. Note that this doesn't move the
// starting line prop, but the starting position of the player's car. So we can ignore
// it in the editor.
function apply_6(args = [])
{
Rsed.assert && (args.length === 4)
|| Rsed.throw("Invalid number of arguments to manifesto command 6. Expected 4 but received " + args.length + ".");
}
// Command: CHANGE_PALETTE_ENTRY. Changes the given palette index to the given r,g,b values.
function apply_10(args = [])
{
Rsed.assert && (args.length === 4)
|| Rsed.throw("Invalid number of arguments to manifesto command 10. Expected 4 but received " + args.length + ".");
const targetPaletteIdx = Math.floor(Number(args[0]));
const red = Math.floor(Number(args[1] * 4));
const green = Math.floor(Number(args[2] * 4));
const blue = Math.floor(Number(args[3] * 4));
Rsed.visual.palette.set_color(targetPaletteIdx, {red, green, blue});
}
// Command: STOP. Stops parsing the manifesto file.
function apply_99(args = [])
{
Rsed.assert && (args.length === 0)
|| Rsed.throw("Invalid number of arguments to manifesto command 99. Expected no arguments but received " + args.length + ".");
}
}
}
function set_track_id(id)
{
Rsed.assert && ((id >= 0) &&
(id <= 7))
|| Rsed.throw("Track id out of bounds.");
trackId = id;
// Certain properties in Rally-Sport are hard-coded for each track, and which RallySportED
// also doesn't let the user edit; so let's hard-code those properties for RallySportED,
// as well.
{
switch (trackId)
{
case 0: trackCheckpoints.push({x:46,y:6}); break;
case 1: trackCheckpoints.push({x:56,y:14}); break;
case 2: trackCheckpoints.push({x:50,y:6}); break;
case 3: trackCheckpoints.push({x:86,y:98}); break;
case 4: trackCheckpoints.push({x:60,y:106}); break;
case 5: trackCheckpoints.push({x:10,y:48}); break;
case 6: trackCheckpoints.push({x:114,y:118}); break;
case 7: trackCheckpoints.push({x:56,y:60}); break;
default: Rsed.throw(`Unknown track id (${trackId}).`);
}
switch (trackId)
{
case 0: waterLevel = -64; break;
case 1: waterLevel = 0; break;
case 2: waterLevel = 0; break;
case 3: waterLevel = -250; break;
case 4: waterLevel = 0; break;
case 5: waterLevel = 0; break;
case 6: waterLevel = -100; break;
case 7: waterLevel = -40; break;
default: Rsed.throw(`Unknown track id (${trackId}).`);
}
Rsed.visual.palette.set_palette((trackId === 4)? 1 :
(trackId === 7)? 3 : 0);
}
return;
}
function set_palat_id(id)
{
Rsed.assert && ((id >= 0) &&
(id <= 1))
|| Rsed.throw("PALAT id out of bounds.");
palatId = id;
}
function set_required_loader_version(version)
{
loaderVersion = version;
}
}
// An empty project that lets the renderer etc. spin even when there's no
// actual project data loaded.
Rsed.project.placeholder =
{
areAllChangesSaved: true,
isPlaceholder: true,
name: "",
manifesto: "",
trackId: 0,
set_track_id: ()=>{Rsed.throw("Can't set the track id of a null project.");},
varimaa:
{
width: 0,
height: 0,
tile_at:()=>0,
set_tile_value_at:()=>{},
},
maasto:
{
width: 0,
height: 0,
tile_at: ()=>0,
set_tile_value_at: ()=>{},
},
palat:
{
texture:()=>{},
},
props:
{
name: ()=>("undefined"),
mesh: ()=>{},
texture: ()=>{},
},
kierros:
{
checkpoints: [],
}
};
/*
* Most recent known filename: js/project/hitable.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
// The raw bytes of a ZIP file containing Rally-Sport's default HITABLE.TXT file.
Rsed.project.hitableZip = new Uint8Array(
[0x50,0x4b,0x03,0x04,0x14,0x03,0x00,0x00,0x08,0x00,0x12,0x7a,
0x8a,0x21,0xe2,0x39,0x05,0xfa,0xb1,0x00,0x00,0x00,0xc0,0x09,
0x00,0x00,0x0b,0x00,0x00,0x00,0x48,0x49,0x54,0x41,0x42,0x4c,
0x45,0x2e,0x54,0x58,0x54,0xed,0x95,0x31,0x0a,0x02,0x31,0x10,
0x45,0xad,0x17,0xf6,0x0e,0x5e,0x60,0x61,0x66,0xf2,0xa3,0x6e,
0x3a,0x5b,0x6f,0xb2,0x8d,0x82,0xe0,0xfd,0x05,0xc1,0xf2,0x89,
0x19,0xc4,0x2a,0x69,0x1f,0x1f,0x92,0xc7,0xfc,0xcc,0x79,0xb9,
0x3c,0xae,0xdb,0xed,0xbe,0xed,0xf6,0xaf,0x63,0xd6,0x8a,0x35,
0xb3,0x79,0xea,0x20,0xde,0x8c,0x08,0x66,0x02,0x33,0x81,0x99,
0x82,0x99,0x82,0x19,0x61,0x46,0x98,0xa9,0xef,0xcc,0x02,0x67,
0x9e,0x86,0xb7,0x9f,0x79,0x13,0x7a,0x13,0xda,0x89,0x84,0x1d,
0xa1,0x83,0x48,0x38,0x10,0x3a,0x08,0x20,0x87,0x66,0x48,0xd4,
0xed,0xcd,0x9b,0xa3,0x1d,0x47,0x07,0xc1,0x73,0x90,0x78,0x69,
0x05,0x72,0xc4,0x97,0x9e,0xf0,0x6e,0x2b,0xdd,0xcd,0xb1,0x3f,
0xee,0x29,0x6f,0xd6,0xdd,0xc6,0x40,0x52,0x90,0x08,0x49,0xfd,
0x30,0x07,0x96,0x30,0x4a,0x64,0x25,0xe2,0x96,0xea,0x69,0x60,
0x4f,0x99,0x28,0xf1,0xf3,0x05,0x12,0x25,0x5a,0x1f,0x48,0x94,
0xf8,0x2d,0x63,0xcc,0xdb,0xdf,0xe6,0x6d,0xec,0xd3,0x2f,0xf6,
0xe9,0x13,0x50,0x4b,0x01,0x02,0x3f,0x03,0x14,0x03,0x00,0x00,
0x08,0x00,0x12,0x7a,0x8a,0x21,0xe2,0x39,0x05,0xfa,0xb1,0x00,
0x00,0x00,0xc0,0x09,0x00,0x00,0x0b,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x20,0x80,0xb4,0x81,0x00,0x00,0x00,0x00,
0x48,0x49,0x54,0x41,0x42,0x4c,0x45,0x2e,0x54,0x58,0x54,0x50,
0x4b,0x05,0x06,0x00,0x00,0x00,0x00,0x01,0x00,0x01,0x00,0x39,
0x00,0x00,0x00,0xda,0x00,0x00,0x00,0x00,0x00]);
/*
* Most recent known filename: js/misc/constants.js
*
* Tarpeeksi Hyvae Soft 2019 /
* RallySportED-js
*
*/
"use strict";
Rsed.constants = Object.freeze(
{
// The resolution, in pixels, of a PALA texture.
palaWidth: 16,
palaHeight: 16,
// For rendering; the side length, in world units, of a single ground tile.
groundTileSize: 120,
// The margins, in number of tiles, on the sides of the track past which the user is
// not allowed to move props (so that they don't accidentally get moved out of reach,
// etc.).
propTileMargin: -3,
// The maximum number of props on a track.
maxPropCount: 14,
// How many hard-coded palettes there are in Rally-Sport's demo version.
numPalettes: 4,
// How many colors there are per palette.
paletteSize: 32,
// A URL pointing to the root of Rally-Sport Content, the service from which
// RallySportED-js will fetch track data. It would ideally be located on the
// same origin, to avoid CORS issues.
rallySportContentURL: `${window.location.origin}/rallysport-content`,
});
/*
* Most recent known filename: js/world/world.js
*
* Tarpeeksi Hyvae Soft 2019 /
* RallySportED-js
*
*/
"use strict";
Rsed.world = {};
/*
* Most recent known filename: js/world/mesh-builder.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
// Provides functions returning renderable 3d meshes of various world items - like the track and
// its props - accounting for user-specified arguments such as camera position.
Rsed.world.meshBuilder = (function()
{
const publicInterface =
{
// Returns a renderable 3d mesh of the current project's track from the given viewing position
// (in tile units). The mesh will be assigned such world coordinates that it'll be located
// roughly in the middle of the canvas when rendered.
track_mesh: function(args = {})
{
Rsed.throw_if_not_type("object", args);
args =
{
// Default args.
...{
// The camera's tile position in integer values.
cameraPos: {
x: 0,
y: 0,
z: 0,
},
// The camera's world position in floating-point values - e.g. the same as
// 'cameraPos' but without having rounded to integer values. If this is given,
// camera movement will be pixel-based (smooth) instead of tile-based (jagged).
cameraPosFloat: undefined,
// Whether to draw props with solid colors(/textures) or with just a wireframe.
solidProps: true,
includeWireframe: false,
paintHoverPala: false,
},
...args,
};
if (!args.cameraPosFloat)
{
args.cameraPosFloat = args.cameraPos;
}
// Returns true if the given XY coordinates are out of track bounds.
function out_of_bounds(x, y)
{
return Boolean((x < 0) || (x >= Rsed.core.current_project().maasto.width) ||
(y < 1) || (y > Rsed.core.current_project().maasto.height));
}
// The polygons that make up the track mesh.
const trackPolygons = [];
// We'll shift the track mesh by these values (world units) to center the mesh on screen.
// Note that we adjust Z to account for vertical camera zooming.
const centerView = {x: -((Rsed.world.camera.view_width / 2) * Rsed.constants.groundTileSize),
y: (-650 + args.cameraPos.y),
z: (3628 - (Rsed.world.camera.rotation().x / 7.5) + (Rsed.constants.groundTileSize * 3.5))};
const mouseHover = Rsed.ui.inputState.current_mouse_hover();
const mouseGrab = Rsed.ui.inputState.current_mouse_grab();
const fractionX = (args.cameraPosFloat.x - args.cameraPos.x);
const fractionZ = (args.cameraPosFloat.z - args.cameraPos.z);
const project = Rsed.core.current_project();
for (let z = 0; z < Rsed.world.camera.view_height; z++)
{
// Add the ground tiles.
for (let x = 0; x < Rsed.world.camera.view_width; x++)
{
// Coordinates of the current ground tile.
const tileX = (x + args.cameraPos.x);
const tileZ = (z + args.cameraPos.z);
if (out_of_bounds(tileX, tileZ))
{
continue;
}
const isCornerTile = ((x == 0) ||
(z == 0) ||
(x == (Rsed.world.camera.view_width - 1)));
// Coordinates in world units of the ground tile's top left vertex.
const vertX = (((x * Rsed.constants.groundTileSize) + centerView.x) - (fractionX * Rsed.constants.groundTileSize));
const vertZ = ((centerView.z - (z * Rsed.constants.groundTileSize)) + (fractionZ * Rsed.constants.groundTileSize));
const tilePalaIdx = (()=>
{
let idx = project.varimaa.tile_at(tileX, (tileZ - 1));
if (args.paintHoverPala &&
!mouseGrab &&
(mouseHover && (mouseHover.type === "ground")) &&
(Math.abs(mouseHover.groundTileX - tileX) <= Rsed.ui.groundBrush.brush_size()) &&
(Math.abs(mouseHover.groundTileY - (tileZ - 1)) <= Rsed.ui.groundBrush.brush_size()))
{
idx = Rsed.ui.groundBrush.brush_pala_idx();
}
return idx;
})();
// Construct the ground quad polygon.
{
// The heights of the ground quad's corner points.
let height1 = project.maasto.tile_at( tileX,       tileZ);
let height2 = project.maasto.tile_at((tileX + 1),  tileZ);
let height3 = project.maasto.tile_at((tileX + 1), (tileZ - 1));
let height4 = project.maasto.tile_at( tileX,      (tileZ - 1));
// We'll do rudimentary shading of the polygon based on its orientation.
// Ideally, the shading would replicate that of Rally-Sport, but this
// particular implementation doesn't.
const heightDiff = Math.max(150, Math.min(255, (255 - ((height1 - height3) * 2))));
// Each track in Rally-Sport has a water level, i.e. a height to which all water
// tiles' corners will be set. The tiles' actual height can be lower, in which case
// driving onto them will cause the car to become submerged under the apparent water
// level. In other words, the game will render all water tiles flush with the water
// level, but also keeps track of the tiles' actual height for car-ground collisions.
//
// In wireframe mode, we'll draw the ground tile heights as they are, but in non-
// wireframe mode, we'll make them flush with the track's water level.
if (!args.includeWireframe)
{
if (tilePalaIdx == 0) // Water tiles are those whose PALA index is 0.
{
height1 = project.waterLevel;
height2 = project.waterLevel;
height3 = project.waterLevel;
height4 = project.waterLevel;
}
// This tile is not a water tile but is adjacent to one. In that case, we'll
// adjust the heights of such neighboring corners.
else
{
if (project.varimaa.tile_at(tileX, (tileZ - 1) + 1) == 0)
{
height2 = project.waterLevel;
height1 = project.waterLevel;
}
if (project.varimaa.tile_at(tileX, (tileZ - 1) - 1) == 0)
{
height3 = project.waterLevel;
height4 = project.waterLevel;
}
if (project.varimaa.tile_at(tileX - 1, (tileZ - 1)) == 0)
{
height1 = project.waterLevel;
height4 = project.waterLevel;
}
if (project.varimaa.tile_at(tileX + 1, (tileZ - 1)) == 0)
{
height2 = project.waterLevel;
height3 = project.waterLevel;
}
if (project.varimaa.tile_at(tileX + 1, (tileZ - 1) + 1) == 0)
{
height2 = project.waterLevel;
}
if (project.varimaa.tile_at(tileX - 1, (tileZ - 1) + 1) == 0)
{
height1 = project.waterLevel;
}
if (project.varimaa.tile_at(tileX + 1, (tileZ - 1) - 1) == 0)
{
height3 = project.waterLevel;
}
if (project.varimaa.tile_at(tileX - 1, (tileZ - 1) - 1) == 0)
{
height4 = project.waterLevel;
}
}
}
height1 += centerView.y;
height2 += centerView.y;
height3 += centerView.y;
height4 += centerView.y;
const texture = project.palat.texture[tilePalaIdx];
const groundQuad = Rngon.ngon([Rngon.vertex(vertX, height1, vertZ, 0, 0),
Rngon.vertex((vertX + Rsed.constants.groundTileSize), height2, vertZ, 1, 0),
Rngon.vertex((vertX + Rsed.constants.groundTileSize), height3, (vertZ + Rsed.constants.groundTileSize), 1, 1),
Rngon.vertex(vertX, height4, (vertZ + Rsed.constants.groundTileSize), 0, 1)],
{
color: Rngon.color_rgba(heightDiff, heightDiff, heightDiff),
texture: texture,
hasWireframe: (!isCornerTile && args.includeWireframe),
auxiliary:
{
// We'll encode this ground quad's tile coordinates into a 32-bit id value, which during
// rasterization we'll write into the mouse-picking buffer, so we can later determine which
// quad the mouse cursor is hovering over.
mousePickId: Rsed.ui.mouse_picking_element("ground",
{
texture: texture,
groundTileX: tileX,
groundTileY: (tileZ - 1),
}),
isCorner: isCornerTile,
}
});
trackPolygons.push(groundQuad);
}
}
// Add the billboard and bridge tiles. We do this as a separate loop from adding
// the ground tiles so that the n-gons are properly sorted by depth for rendering.
// Otherwise, billboard/bridge tiles can become obscured by ground tiles behind
// them.
for (let x = 0; x < Rsed.world.camera.view_width; x++)
{
const tileX = (x + args.cameraPos.x);
const tileZ = (z + args.cameraPos.z);
if (out_of_bounds(tileX, tileZ))
{
continue;
}
const isCornerTile = ((x == 0) ||
(z == 0) ||
(x == (Rsed.world.camera.view_width - 1)));
const vertX = (((x * Rsed.constants.groundTileSize) + centerView.x) - (fractionX * Rsed.constants.groundTileSize));
const vertZ = ((centerView.z - (z * Rsed.constants.groundTileSize)) + (fractionZ * Rsed.constants.groundTileSize));
const tilePalaIdx = (()=>
{
let idx = project.varimaa.tile_at(tileX, (tileZ - 1));
if ( args.paintHoverPala &&
!mouseGrab &&
(mouseHover && (mouseHover.type === "ground")) &&
(Math.abs(mouseHover.groundTileX - tileX) <= Rsed.ui.groundBrush.brush_size()) &&
(Math.abs(mouseHover.groundTileY - (tileZ - 1)) <= Rsed.ui.groundBrush.brush_size()))
{
idx = Rsed.ui.groundBrush.brush_pala_idx();
}
return idx;
})();
// If this tile has a billboard, add it.
const billboardPalaIdx = project.palat.billboard_idx(tilePalaIdx, tileX, (tileZ - 1));
if (billboardPalaIdx != null)
{
const baseHeight = centerView.y + project.maasto.tile_at(tileX, (tileZ - 1));
const billboardTexture = project.palat.texture[billboardPalaIdx];
const billboardVertices = (()=>
{
// Bridges (lay horizontally).
if (billboardPalaIdx == 177)
{
return [Rngon.vertex( vertX,  centerView.y, vertZ, 0, 0),
Rngon.vertex((vertX + Rsed.constants.groundTileSize), centerView.y, vertZ, 1, 0),
Rngon.vertex((vertX + Rsed.constants.groundTileSize), centerView.y, (vertZ+Rsed.constants.groundTileSize), 1, 1),
Rngon.vertex( vertX, centerView.y, (vertZ+Rsed.constants.groundTileSize), 0, 1)];
}
// Other billboards (lay vertically).
else
{
return [Rngon.vertex( vertX, baseHeight, vertZ, 0, 0),
Rngon.vertex((vertX + Rsed.constants.groundTileSize), baseHeight, vertZ, 1, 0),
Rngon.vertex((vertX + Rsed.constants.groundTileSize), baseHeight+Rsed.constants.groundTileSize, vertZ, 1, 1),
Rngon.vertex( vertX, baseHeight+Rsed.constants.groundTileSize, vertZ, 0, 1)];
}
})();
const billboardQuad = Rngon.ngon(billboardVertices,
{
texture: billboardTexture,
hasFill: true,
auxiliary:
{
mousePickId: null,
isCorner: isCornerTile,
}
});
trackPolygons.push(billboardQuad);
}
}
}
// Add any track prop meshes that should be visible on the currently-drawn track.
const propLocations = project.props.locations_of_props_on_track(project.track_id());
propLocations.forEach((pos, idx)=>
{
if ((pos.x >= (args.cameraPos.x * Rsed.constants.groundTileSize)) &&
(pos.x <= ((args.cameraPos.x + Rsed.world.camera.view_width) * Rsed.constants.groundTileSize)) &&
(pos.z >= (args.cameraPos.z * Rsed.constants.groundTileSize)) &&
(pos.z <= ((args.cameraPos.z + Rsed.world.camera.view_height) * Rsed.constants.groundTileSize)))
{
const x = ((pos.x + centerView.x - (args.cameraPos.x * Rsed.constants.groundTileSize)) - (fractionX * Rsed.constants.groundTileSize));
const z = ((centerView.z - pos.z + (args.cameraPos.z * Rsed.constants.groundTileSize)) + (fractionZ * Rsed.constants.groundTileSize));
const groundHeight = centerView.y + project.maasto.tile_at((pos.x / Rsed.constants.groundTileSize), (pos.z / Rsed.constants.groundTileSize));
const y = (groundHeight + pos.y);
trackPolygons.push(...this.prop_mesh(pos.propId, idx,
{
position:
{
x,
y,
z,
},
...args,
}));
}
});
return Rngon.mesh(trackPolygons);
},
// Returns a renderable 3d mesh of the given prop at the given position (in world units).
prop_mesh: (propId = 0, idxOnTrack = 0, args = {})=>
{
Rsed.throw_if_not_type("object", args);
args =
{
...// Default args.
{
position:
{
x: 0,
y: 0,
z: 0,
},
solidProps: true,
includeWireframe: false,
},
...args
};
const project = Rsed.core.current_project();
const srcMesh = project.props.mesh[propId];
const dstMesh = [];
srcMesh.ngons.forEach(ngon=>
{
const texture = (args.solidProps? (ngon.fill.type === "texture"? project.props.texture[ngon.fill.idx]
: null)
: null);
const propNgon = Rngon.ngon(ngon.vertices.map(v=>Rngon.vertex((v.x + args.position.x),
(v.y + args.position.y),
(v.z + args.position.z))),
{
color: (args.solidProps? (ngon.fill.type === "texture"? Rsed.visual.palette.color_at_idx(0)
: Rsed.visual.palette.color_at_idx(ngon.fill.idx))
: Rsed.visual.palette.color_at_idx(0, true)),
texture: texture,
textureMapping: "ortho",
wireframeColor: Rsed.visual.palette.color_at_idx(args.solidProps? "black" : "lightgray"),
hasWireframe: (args.solidProps? args.includeWireframe : true),
hasFill: args.solidProps,
auxiliary:
{
mousePickId: Rsed.ui.mouse_picking_element("prop",
{
texture: texture,
propId: propId,
propTrackIdx: idxOnTrack
}),
}
});
dstMesh.push(propNgon);
});
return dstMesh;
},
};
return publicInterface;
})();
/*
* Most recent known filename: js/world/camera.js
*
* Tarpeeksi Hyvae Soft 2018 /
* RallySportED-js
*
*/
"use strict";
Rsed.world.camera = (function()
{
// The camera's starting position, in tile units.
const defaultPosition = {x:15.0, y:0.0, z:13.0};
// The camera's current position, in tile units.
const position = {...defaultPosition};
// The camera's rotation, in degrees.
const rotation = {x:16, y:0, z:0};
let verticalZoom = 0;
const publicInterface =
{
// Restore the camera's default position.
reset_camera_position: function()
{
position.x = defaultPosition.x;
position.y = defaultPosition.y;
position.z = defaultPosition.z;
},
set_camera_position: function(x, y, z)
{
position.x = 0;
position.y = 0;
position.z = 0;
this.move_camera(x, y, z);
},
move_camera: function(deltaX, deltaY, deltaZ, enforceBounds = true)
{
const prevPos = this.position_floored();
position.x += deltaX;
position.y += deltaY;
position.z += deltaZ;
// Prevent the camera from moving past the track boundaries.
if (enforceBounds)
{
const marginX = 8;
const marginY = 9;
const maxX = (Rsed.core.current_project().maasto.width - this.view_width);
const maxY = (Rsed.core.current_project().maasto.width - this.view_height + 1);
position.x = Math.max(-marginX, Math.min(position.x, (maxX + marginX)));
position.z = Math.max(-marginY, Math.min(position.z, (maxY + marginY)));
}
const newPos = this.position_floored();
const posDelta =
{
x: (newPos.x - prevPos.x),
y: (newPos.y - prevPos.y),
z: (newPos.z - prevPos.z),
}
// If the camera moved...
if (posDelta.x || posDelta.y || posDelta.z)
{
window.close_dropdowns(false);
// Force mouse hover to update, since there might now be a different tile under
// the cursor.
Rsed.ui.inputState.update_mouse_hover();
// If the user is grabbing onto a prop while the camera moves, move the prop as well.
{
const grab = Rsed.ui.inputState.current_mouse_grab();
if (grab && (grab.type === "prop") &&
Rsed.ui.inputState.left_mouse_button_down())
{
// Note: the starting line (always prop #0) is not user-editable.
if (grab.propTrackIdx !== 0)
{
Rsed.core.current_project().props.move(Rsed.core.current_project().track_id(),
grab.propTrackIdx,
{
x: (posDelta.x * Rsed.constants.groundTileSize),
z: (posDelta.z * Rsed.constants.groundTileSize),
});
}
}
}
}
return;
},
rotate_camera: function(xDelta, yDelta, zDelta)
{
Rsed.throw_if_not_type("number", xDelta, yDelta, zDelta);
rotation.x += xDelta;
rotation.y += yDelta;
rotation.z += zDelta;
return;
},
// Moves the camera up/down while tilting it up/down, so that at its highest
// point, the camera is pointed directly down, and at its lowest point toward
// the horizon.
zoom_vertically: function(delta)
{
Rsed.throw_if_not_type("number", delta);
verticalZoom = Math.max(0, Math.min(296, (verticalZoom + delta)));
position.y = (-verticalZoom * 7);
rotation.x = (16 + (verticalZoom / 4));
return;
},
vertical_zoom: function()
{
return verticalZoom;
},
rotation: function()
{
return Rngon.rotation_vector(rotation.x, rotation.y, rotation.z);
},
position_floored: function()
{
return {
x: Math.floor(position.x),
y: Math.floor(position.y),
z: Math.floor(position.z),
};
},
position: function()
{
return {...position};
},
world_position: function()
{
return {
x: (position.x * Rsed.constants.groundTileSize),
y: (position.y * Rsed.constants.groundTileSize),
z: (position.z * Rsed.constants.groundTileSize),
};
},
// How many track ground tiles, horizontally and vertically, should be
// visible on screen when using this camera.
view_width: 28,
view_height: 31,
};
publicInterface.reset_camera_position();
return publicInterface;
})();
/*
* Most recent known filename: js/visual/texture.js
*
* Tarpeeksi Hyvae Soft 2018 /
* RallySportED-js
*
*/
"use strict";
Rsed.visual = Rsed.visual || {};
// Implements a 32-bit texture whose output interface is compatible with the retro n-gon
// renderer's texture_rgba() object (so that n-gons can be textured with the object from
// this function and rendered with the retro n-gon renderer).
Rsed.visual.texture = function(args = {})
{
args =
{
...{
// Pixel RGB values, each element being {red, green, blue} (value range 0-255).
pixels: [],
// Each pixel's corresponding palette index.
indices: [],
// The texture's dimensions.
width: 0,
height: 0,
// Whether to flip (mirror) the texture's pixels.
flipped: "no", // | "vertical"
// A function with which a given texel's color in the texture can be altered.
set_pixel_at: (x, y, newColorIdx)=>{},
},
...args
};
Rsed.assert && ((args.width > 0) &&
(args.height > 0) &&
(args.pixels.length) &&
(args.indices.length))
|| Rsed.throw("Expected non-empty texture data.");
Rsed.assert && ((args.indices.length === (args.width * args.height)) &&
(args.pixels.length === (args.width * args.height)) &&
(args.indices.length === args.pixels.length))
|| Rsed.throw("Mismatch between size of texture data and its resolution.");
switch (args.flipped)
{
case "no": break;
case "vertical":
{
for (let y = 0; y < args.height/2; y++)
{
// Swap horizontal rows vertically.
for (let x = 0; x < args.width; x++)
{
const idxTop = (x + y * args.width);
const idxBottom = (x + (args.height - y - 1) * args.width);
[args.pixels[idxTop], args.pixels[idxBottom]] = [args.pixels[idxBottom], args.pixels[idxTop]];
[args.indices[idxTop], args.indices[idxBottom]] = [args.indices[idxBottom], args.indices[idxTop]];
}
}
break;
}
default: Rsed.throw("Unknown texture-flipping mode."); break;
}
// Generate mipmaps. Each successive mipmap is one half of the previous
// mipmap's width and height, starting from the full resolution and working
// down to 1 x 1. So mipmaps[0] is the original, full-resolution texture,
// and mipmaps[mipmaps.length-1] is the smallest, 1 x 1 texture.
const mipmaps = [];
for (let m = 0; ; m++)
{
const mipWidth = Math.max(1, Math.floor(args.width / Math.pow(2, m)));
const mipHeight = Math.max(1, Math.floor(args.height / Math.pow(2, m)));
// Downscale the texture image to the next mip level.
const mipPixelData = [];
{
const deltaW = (args.width / mipWidth);
const deltaH = (args.height / mipHeight);
for (let y = 0; y < mipHeight; y++)
{
for (let x = 0; x < mipWidth; x++)
{
const dstIdx = (x + y * mipWidth);
const srcIdx = (Math.floor(x * deltaW) + Math.floor(y * deltaH) * args.width);
mipPixelData[dstIdx] = args.pixels[srcIdx];
}
}
}
mipmaps.push({
width: mipWidth,
height: mipHeight,
pixels: mipPixelData,
});
// We're finished generating mip levels once we've done them down to 1 x 1.
if ((mipWidth === 1) && (mipHeight === 1))
{
if (!mipmaps.length)
{
Rsed.throw("Failed to generate mip levels for a texture.");
}
break;
}
}
// Note: The elements of the 'pixels' array are returned by reference (they're objects of the
// form {red, green, blue, alpha}). This is done to allow textures to be pre-generated and still
// have their colors reflect any changes to the global palette without requiring a re-generation.
const publicInterface = Object.freeze(
{
width: args.width,
height: args.height,
flipped: args.flipped,
pixels: args.pixels,
indices: args.indices,
mipLevels: mipmaps,
set_pixel_at: args.set_pixel_at,
args,
});
return publicInterface;
}
/*
* Most recent known filename: js/visual/palette.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
Rsed.visual = Rsed.visual || {};
Rsed.visual.palette = (function()
{
// How many colors there are in a single palette.
const numColorsInPalette = 32;
// The four hard-coded palettes in Rally-Sport's demo. These should not be changed
// during run-time.
const rallySportPalettes = [
// Palette #1.
[{red:0, green:0, blue:0},
{red:8, green:64, blue:16},
{red:16, green:96, blue:36},
{red:24, green:128, blue:48},
{red:252, green:0, blue:0},
{red:252, green:252, blue:252},
{red:192, green:192, blue:192},
{red:128, green:128, blue:128},
{red:64, green:64, blue:64},
{red:0, green:0, blue:252},
{red:72, green:128, blue:252},
{red:208, green:100, blue:252},
{red:208, green:72, blue:44},
{red:252, green:112, blue:76},
{red:16, green:96, blue:32},
{red:32, green:192, blue:64},
{red:228, green:56, blue:244},
{red:132, green:36, blue:172},
{red:68, green:92, blue:252},
{red:252, green:252, blue:48},
{red:32, green:32, blue:32},
{red:152, green:48, blue:24},
{red:80, green:24, blue:12},
{red:124, green:124, blue:24},
{red:128, green:0, blue:0},
{red:12, green:20, blue:132},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:136, green:28, blue:128},
{red:16, green:252, blue:8}],
// Palette #2.
[{red:0, green:0, blue:0},
{red:80, green:88, blue:104},
{red:96, green:104, blue:120},
{red:112, green:128, blue:144},
{red:252, green:0, blue:0},
{red:252, green:252, blue:252},
{red:192, green:192, blue:192},
{red:128, green:128, blue:128},
{red:64, green:64, blue:64},
{red:0, green:0, blue:252},
{red:72, green:128, blue:252},
{red:208, green:100, blue:252},
{red:208, green:72, blue:44},
{red:252, green:112, blue:76},
{red:8, green:136, blue:16},
{red:32, green:192, blue:64},
{red:228, green:56, blue:244},
{red:132, green:36, blue:172},
{red:68, green:92, blue:252},
{red:252, green:252, blue:48},
{red:32, green:32, blue:32},
{red:152, green:48, blue:24},
{red:80, green:24, blue:12},
{red:124, green:124, blue:24},
{red:128, green:0, blue:0},
{red:12, green:20, blue:132},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:136, green:28, blue:128},
{red:16, green:252, blue:8}],
// Palette #3.
[{red:0, green:0, blue:0},
{red:72, green:20, blue:12},
{red:144, green:44, blue:20},
{red:168, green:56, blue:28},
{red:252, green:0, blue:0},
{red:252, green:252, blue:252},
{red:192, green:192, blue:192},
{red:128, green:128, blue:128},
{red:64, green:64, blue:64},
{red:0, green:0, blue:252},
{red:72, green:128, blue:252},
{red:208, green:100, blue:252},
{red:208, green:72, blue:44},
{red:252, green:112, blue:76},
{red:16, green:96, blue:32},
{red:32, green:192, blue:64},
{red:228, green:56, blue:244},
{red:132, green:36, blue:172},
{red:68, green:92, blue:252},
{red:252, green:252, blue:48},
{red:32, green:32, blue:32},
{red:152, green:48, blue:24},
{red:80, green:24, blue:12},
{red:124, green:124, blue:24},
{red:128, green:0, blue:0},
{red:12, green:20, blue:132},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:136, green:28, blue:128},
{red:16, green:252, blue:8}],
// Palette #4.
[{red:0, green:0, blue:0},
{red:28, green:52, blue:8},
{red:64, green:64, blue:16},
{red:80, green:84, blue:28},
{red:252, green:0, blue:0},
{red:252, green:252, blue:252},
{red:192, green:192, blue:192},
{red:128, green:128, blue:128},
{red:64, green:64, blue:64},
{red:0, green:0, blue:252},
{red:72, green:128, blue:252},
{red:208, green:100, blue:252},
{red:208, green:72, blue:44},
{red:252, green:112, blue:76},
{red:32, green:64, blue:32},
{red:64, green:128, blue:64},
{red:228, green:56, blue:244},
{red:132, green:36, blue:172},
{red:68, green:92, blue:252},
{red:252, green:252, blue:48},
{red:32, green:32, blue:32},
{red:152, green:48, blue:24},
{red:80, green:24, blue:12},
{red:124, green:124, blue:24},
{red:128, green:0, blue:0},
{red:12, green:20, blue:132},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:252, green:252, blue:252},
{red:136, green:28, blue:128},
{red:16, green:252, blue:8}]
];
// The palette we'll operate on; which is to say, when the user requests us to return a
// color for a particular palette index, or to change the color at a particular index,
// this is the palette we'll use.
const activePalette = (new Array(256)).fill().map(e=>({red:127,green:127,blue:127,alpha:255,unitRange:{red:1, green:1, blue:1, alpha:1}}));
const activePaletteWithAlpha = (new Array(256)).fill().map(e=>({red:127,green:127,blue:127,alpha:255,unitRange:{red:1, green:1, blue:1, alpha:1}}));
const publicInterface =
{
numColorsInPalette,
// Return the color at the given index in the palette. Optionally, the index may be
// a string identifying one of the pre-set UI colors (which are otherwise the same as
// regular colors, but guaranteed to remain constant even when the palette is otherwise
// altered during operation). The color is returned as an object containing the color's
// red, green, and blue channels as properties. Aside from the UI colors, the object
// will be returned by reference to an index in the palette, so any changes to the
// palette afterwards will be reflected in colors returned previously.
color_at_idx: (colorIdx = 0, useAlpha = false)=>
{
// Named UI colors.
switch (colorIdx)
{
case "background":  return {red:255,  green:255,  blue:16,  alpha:255};
case "black":       return {red:0,   green:0,   blue:0,   alpha:255};
case "gray":
case "grey":        return {red:127, green:127, blue:127, alpha:255};
case "lightgray":
case "lightgrey":   return {red:192, green:192, blue:192, alpha:255};
case "dimgray":
case "dimgrey":     return {red:64,  green:64,  blue:64,  alpha:255};
case "white":       return {red:255, green:255, blue:255, alpha:255};
case "blue":        return {red:0,   green:0,   blue:255, alpha:255};
case "darkorchid":  return {red:153, green:50,  blue:204, alpha:255};
case "paleorchid":  return {red:158, green:123, blue:176, alpha:255};
case "yellow":      return {red:255, green:255, blue:0,   alpha:255};
case "red":         return {red:255, green:0,   blue:0,   alpha:255};
case "green":       return {red:0,   green:255, blue:0,   alpha:255};
case "gold":        return {red:179, green:112, blue:25,  alpha:255};
default: break;
}
return (useAlpha? activePaletteWithAlpha : activePalette)[colorIdx];
},
// Assign one of the four Rally-Sport palettes as the current active one.
set_palette: (paletteIdx)=>
{
Rsed.assert && ((paletteIdx >= 0) &&
(paletteIdx < rallySportPalettes.length))
|| Rsed.throw("Trying to access a palette index out of bounds.");
rallySportPalettes[paletteIdx].forEach((color, idx)=>
{
activePaletteWithAlpha[idx].red = color.red;
activePaletteWithAlpha[idx].green = color.green;
activePaletteWithAlpha[idx].blue = color.blue;
activePaletteWithAlpha[idx].alpha = ((idx === 0)? 0 : 255);
activePalette[idx].red = color.red;
activePalette[idx].green = color.green;
activePalette[idx].blue = color.blue;
activePalette[idx].alpha = 255;
});
},
// Change the color at the given palette index in the current active palette.
set_color: (colorIdx = 0, newColor = {red:0,green:0,blue:0})=>
{
Rsed.assert && ((colorIdx >= 0) &&
(colorIdx < numColorsInPalette))
|| Rsed.throw(`Trying to access a palette color out of bounds (#${colorIdx}).`);
newColor =
{
...
{
red: activePalette[colorIdx].red,
green: activePalette[colorIdx].green,
blue: activePalette[colorIdx].blue,
},
...newColor,
}
activePaletteWithAlpha[colorIdx].red = newColor.red;
activePaletteWithAlpha[colorIdx].green = newColor.green;
activePaletteWithAlpha[colorIdx].blue = newColor.blue;
activePaletteWithAlpha[colorIdx].alpha = ((colorIdx === 0)? 0 : 255);
activePalette[colorIdx].red = newColor.red;
activePalette[colorIdx].green = newColor.green;
activePalette[colorIdx].blue = newColor.blue;
activePalette[colorIdx].alpha = 255;
},
};
return publicInterface;
})();
/*
* Most recent known filename: js/visual/canvas.js
*
* Tarpeeksi Hyvae Soft 2018 /
* RallySportED-js
*
*/
"use strict";
Rsed.visual = Rsed.visual || {};
// Provides a canvas for RallySportED-js to render into.
Rsed.visual.canvas =
{
width: 0,
height: 0,
scalingFactor: 0.25,
domElement: document.getElementById("render-canvas"), // May not be available during unit tests.
domElementID: null, // The canvas DOM element may not be available during unit tests, so let's not initialize this here.
// One element for each pixel on the canvas. Will be populated during rendering
// with metainformation about the pixel - e.g. what kind of a polygon populates
// it. For use in determining what the mouse cursor is hovering over on the
// canvas.
mousePickingBuffer: [],
};
// The canvas DOM element is not available during unit testing. Otherwise, we expect
// it to be present.
if (!Rsed.unitTestRun)
{
Rsed.assert && (Rsed.visual.canvas.domElement != null)
|| Rsed.throw("Failed to find a canvas element to render into.");
Rsed.visual.canvas.domElementID = Rsed.visual.canvas.domElement.getAttribute("id");
// A bit of a kludge to prevent certain inputs from sticking if released while a non-
// RallySportED element has focus.
Rsed.visual.canvas.domElement.onmouseleave = function(event)
{
Rsed.ui.inputState.reset_mouse_buttons_state();
Rsed.ui.inputState.reset_modifier_keys_state();
return;
};
Rsed.visual.canvas.domElement.ontouchstart = function(event)
{
Rsed.ui.inputState.set_is_touching(true, {startX: event.touches[0].clientX, startY: event.touches[0].clientY});
event.preventDefault();
return;
};
Rsed.visual.canvas.domElement.ontouchend = function(event)
{
Rsed.ui.inputState.set_is_touching(false, {});
event.preventDefault();
return;
};
Rsed.visual.canvas.domElement.ontouchmove = function(event)
{
Rsed.ui.inputState.update_touch_position({x: event.touches[0].clientX, y: event.touches[0].clientY})
event.preventDefault();
return;
};
}
/*
* Most recent known filename: js/track/varimaa.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
Rsed.track = Rsed.track || {};
// Provides information about and the means to modify a track's tilemap (which Rally-Sport
// calls "VARIMAA"). For more information about the track tilemap format used in Rally-Sport,
// check out https://github.com/leikareipa/rallysported/tree/master/docs.
Rsed.track.varimaa = function(varimaaWidth = 0, varimaaHeight = 0, data = Uint8Array)
{
Rsed.assert && (varimaaWidth === varimaaHeight)
|| Rsed.throw("Expected VARIMAA width and height to be equal.");
Rsed.assert && ((varimaaWidth > 0) &&
(varimaaHeight > 0))
|| Rsed.throw("Expected VARIMAA width and height to be positive and non-zero.");
Rsed.assert && (data.byteLength === (varimaaWidth * varimaaHeight))
|| Rsed.throw("Mismatched VARIMAA data length relative to its dimensions.");
const publicInterface =
{
width: varimaaWidth,
height: varimaaHeight,
// Returns the PALA index of the tile at the given track tile coordinates.
tile_at: (x = 0, y = 0)=>
{
x = Math.floor(x);
y = Math.floor(y);
const idx = (x + y * varimaaWidth);
if ((idx < 0) || (idx >= data.byteLength))
{
return 0;
}
return data[idx];
},
// Alter the PALA index at the given tile.
set_tile_value_at: (x = 0, y = 0, newPalaIdx = 0)=>
{
x = Math.floor(x);
y = Math.floor(y);
const idx = (x + y * varimaaWidth);
if ((idx < 0) || (idx >= data.byteLength))
{
return;
}
data[idx] = newPalaIdx;
},
};
return publicInterface;
};
/*
* Most recent known filename: js/track/maasto.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
Rsed.track = Rsed.track || {};
// Provides information about and the means to modify a track's heightmap (which are called
// "MAASTO" in Rally-Sport). For more information about the heightmap format used in Rally-
// Sport, check out https://github.com/leikareipa/rallysported/tree/master/docs.
Rsed.track.maasto = function(maastoWidth = 0, maastoHeight = 0, data = Uint8Array)
{
Rsed.assert && (maastoWidth === maastoHeight)
|| Rsed.throw("Expected MAASTO width and height to be equal.");
Rsed.assert && ((maastoWidth > 0) &&
(maastoHeight > 0))
|| Rsed.throw("Expected MAASTO width and height to be positive and non-zero.");
Rsed.assert && (data.byteLength === (maastoWidth * maastoHeight * 2))
|| Rsed.throw("Mismatched MAASTO data length relative to its dimensions.");
const maxHeightmapValue = 255;
const minHeightmapValue = -510;
const publicInterface =
{
width: maastoWidth,
height: maastoHeight,
// Returns the MAASTO height of the tile at the given track tile coordinates.
tile_at: function(x = 0, y = 0)
{
x = Math.floor(x);
y = Math.floor(y);
// MAASTO data is two bytes per tile.
const idx = ((x + y * maastoWidth) * 2);
if ((idx < 0) || (idx >= data.byteLength))
{
return 0;
}
return two_byte_height_as_integer(data[idx], data[idx+1]);
},
// Alter the MAASTO heightmap at the given tile.
set_tile_value_at: function(x = 0, y = 0, newHeight = 0)
{
newHeight = Math.max(minHeightmapValue, Math.min(maxHeightmapValue, newHeight));
x = Math.floor(x);
y = Math.floor(y);
// Note: MAASTO data is two bytes per tile, so we multiply the idx by two.
const idx = ((x + y * maastoWidth) * 2);
if ((idx < 0) || (idx >= data.byteLength))
{
return;
}
[data[idx], data[idx+1]] = [...integer_height_as_two_bytes(newHeight)];
},
// Reset all height values in the heightmap to the specified height.
bulldoze: function(height)
{
for (let y = 0; y < maastoHeight; y++)
{
for (let x = 0; x < maastoWidth; x++)
{
publicInterface.set_tile_value_at(x, y, height);
}
}
}
};
return publicInterface;
// Converts Rally-Sport's two-byte heightmap value into RallySportED's integer format.
// (For more information about Rally-Sport's heightmaps, see the data format documentation
// at github.com/leikareipa/rallysported/tree/master/docs.)
function two_byte_height_as_integer(byte1, byte2)
{
// Special case: more than -255 below ground level.
if (byte2 == 1)
{
return (-256 - byte1);
}
// Above ground when b2 == 255, otherwise below ground.
else
{
return (byte2 - byte1);
}
}
// Converts RallySportED's heightmap value into Rally-Sport's two-byte height format.
// (For more information about Rally-Sport's heightmaps, see the data format documentation
// at github.com/leikareipa/rallysported/tree/master/docs.)
function integer_height_as_two_bytes(height)
{
let byte1 = 0;
let byte2 = 0;
if (height > 0)
{
byte2 = 255;
byte1 = (255 - height);
}
else if (height <= 0)
{
if (height < -255)
{
byte2 = 1;
byte1 = (Math.abs(height) - 256);
}
else
{
byte2 = 0;
byte1 = Math.abs(height);
}
}
return [byte1, byte2];
}
};
/*
* Most recent known filename: js/track/kierros.js
*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
Rsed.track = Rsed.track || {};
// Provides information about a track's KIERROS data (the AI driver's checkpoints).
// You can learn more about the KIERROS format at https://github.com/leikareipa/rallysported/tree/master/docs.
Rsed.track.kierros = function(data = Uint8Array)
{
const checkpoints = [];
const bytesPerCheckpoint = 8;
const numCheckpoints = ((data.length / bytesPerCheckpoint) - 1);
for (let i = 0; i < numCheckpoints; i++)
{
const idx = (i * bytesPerCheckpoint);
checkpoints.push({
x:          ((data[idx+0] | (data[idx+1] << 8)) / 128),
z:          ((data[idx+2] | (data[idx+3] << 8)) / 128),
orientation: (data[idx+4] | (data[idx+5] << 8)),
speed:       (data[idx+6] | (data[idx+7] << 8)),
});
}
const publicInterface =
{
checkpoints: Object.freeze(checkpoints),
};
return publicInterface;
}
/*
* Most recent known filename: js/track/palat.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
Rsed.track = Rsed.track || {};
// Provides information about and the means to modify a track's textures (which are called
// "PALA" in Rally-Sport). For more information about the track texture format used in Rally-
// Sport, check out https://github.com/leikareipa/rallysported/tree/master/docs.
//
// The palaWidth and palaHeight parameters give the dimensions of a single PALA texture; which
// would typically be 16 x 16. The data array contains the pixels of all of the track's PALA
// textures (normally, about 256 of them), arranged so that the first (width * height) bytes
// are the pixels of the first texture, the next (width * height) bytes those of the second
// texture, etc. Each byte in the array gives the corresponding pixel's RGB color as a palette
// index.
Rsed.track.palat = function(palaWidth = 0, palaHeight = 0, data = Uint8Array)
{
Rsed.assert && (palaWidth === palaHeight)
|| Rsed.throw("Expected PALA width and height to be equal.");
Rsed.assert && ((palaWidth > 0) &&
(palaHeight > 0))
|| Rsed.throw("Expected PALA width and height to be positive and non-zero.");
const palaSize = (palaWidth * palaHeight);
// Pre-compute the individual PALA textures.
const prebakedPalaTextures = new Array(256).fill().map((pala, idx)=>generate_texture(idx));
const publicInterface = Object.freeze(
{
width: palaWidth,
height: palaHeight,
texture: prebakedPalaTextures,
// Copies the given texture's data over the PALA texture at the given index.
// This causes the current texture to be re-generated; a reference to the
// new texture object is returned.
copy_texture_data: function(palaIdx = 0, srcTexture)
{
Rsed.throw_if_not_type("number", palaIdx);
// All PALA textures are expected to be the same resolution.
if ((srcTexture.width !== palaWidth) ||
(srcTexture.height !== palaHeight))
{
Rsed.throw("Invalid PALA texture dimensions for copying.")
}
const dataIdx = (palaIdx * (palaWidth * palaHeight));
for (let i = 0; i < (palaWidth * palaHeight); i++)
{
data[dataIdx + i] = srcTexture.indices[i];
}
// Regenerate this texture to incorporate the changes we've made to the
// master data array.
prebakedPalaTextures[palaIdx] = generate_texture(palaIdx, srcTexture.args);
return prebakedPalaTextures[palaIdx];
},
// Rally-Sport by default has four different 'skins' for spectators, and decides
// which skin a spectator will be given based on the spectator's XY ground tile
// coordinates.
//
// This function returns the PALA index of the skin associated with the given
// ground tile coordinates.
spectator_pala_idx_at: function(tileX = 0, tileY = 0)
{
const firstSpectatorTexIdx = 236; // Index of the first PALA representing a (standing) spectator. Assumes consecutive arrangement.
const numSkins = 4;
const sameRows = ((Rsed.core.current_project().maasto.width === 128)? 16 : 32); // The game will repeat the same pattern of variants on the x axis this many times.
const yOffs = (Math.floor(tileY / sameRows)) % numSkins;
const texOffs = ((tileX + (numSkins - 1)) + (yOffs * (numSkins - 1))) % numSkins;
const palaId = (firstSpectatorTexIdx + texOffs);
return palaId;
},
// When used on ground tiles, some PALA textures are associated with billboards
// - a flat upright polygon stood by the ground tile. For instance, spectators
// and wooden poles are examples of billboards.
//
// This function returns the PALA texture index of the billboard associated
// with the given PALA texture index; or null if the PALA index has no billboard
// associated with it.
billboard_idx: function(palaIdx, groundTileX = 0, groundTileZ = 0)
{
Rsed.throw_if_not_type("number", palaIdx,
groundTileX,
groundTileZ);
switch (palaIdx)
{
// Spectators.
case 240:
case 241:
case 242: return this.spectator_pala_idx_at(groundTileX, groundTileZ);
// Shrubs.
case 243: return 208;
case 244: return 209;
case 245: return 210;
// Small poles.
case 246:
case 247: return 211;
case 250: return 212;
// Bridges.
case 248:
case 249: return 177;
default: return null;
}
},
});
// Returns the given PALA's pixel data as a texture, whose arguments are set as given.
function generate_texture(palaId = 0, args = {})
{
args =
{
...{
flipped: "vertical",
},
...args,
}
const dataIdx = (palaId * palaSize);
// For attempts to access the PALA data out of bounds, return a dummy texture.
if ((dataIdx < 0) ||
((dataIdx + palaSize) >= data.byteLength))
{
return Rsed.visual.texture(
{
...args,
width: 1,
height: 1,
pixels: [Rsed.visual.palette.color_at_idx("black")],
indices: [0],
args: args,
});
}
// Billboard PALAs will have alpha-testing enabled (so color index 0 is see-through),
// while other PALAs will not.
const isBillboardPala = ((palaId == 176) ||
(palaId == 177) ||
((palaId >= 208) && (palaId <= 239)));
// A slice of the entire PALAT data representing the region in which this particular
// PALAT texture's pixels are.
const dataSlice = data.slice(dataIdx, (dataIdx + palaSize));
const pixels = Array.from(dataSlice, (colorIdx)=>Rsed.visual.palette.color_at_idx(colorIdx, isBillboardPala));
return Rsed.visual.texture(
{
...args,
width: palaWidth,
height: palaHeight,
pixels: pixels,
indices: dataSlice,
flipped: "no",
assetId: palaId,
assetType: "palat",
set_pixel_at: function(x = 0, y = 0, newColorIdx = 0)
{
const texelIdx = (x + y * palaWidth);
data[dataIdx + texelIdx] = newColorIdx;
// Regenerate this texture to incorporate the changes we've made to the
// master data array.
prebakedPalaTextures[palaId] = generate_texture(palaId, args);
// Return the updated reference to this texture:
return prebakedPalaTextures[palaId];
},
});
}
return publicInterface;
};
/*
* Most recent known filename: js/track/props.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
Rsed.track = Rsed.track || {};
// Provides information about and the means to modify a track's props (track-side 3d objects,
// like trees and the finish line). For more information about track props, check out the
// documentation at https://github.com/leikareipa/rallysported/tree/master/docs; and the
// prop metadata JSON file, distributable/assets/metadata/props.json.
//
// The textureAtlas parameter provides as an array the pixels of the prop texture atlas, with
// each byte in it giving the corresponding pixel's RGB color as a palette index.
Rsed.track.props = async function(textureAtlas = Uint8Array)
{
const data = await fetch_prop_metadata_from_server();
Rsed.assert && ((typeof data.propMeshes !== "undefined") &&
(typeof data.propLocations !== "undefined") &&
(typeof data.propNames !== "undefined"))
|| Rsed.throw("Missing properties in prop metadata.");
// Filter out comments and other auxiliary info from the JSON data; and sort by the relevant
// index, so we can access the xth element with [x].
const propNames = data.propNames.filter(m=>(typeof m.propId !== "undefined"))
.sort((a, b)=>((a.propId === b.propId)? 0 : ((a.propId > b.propId)? 1 : -1)));
const propMeshes = data.propMeshes.filter(m=>(typeof m.propId !== "undefined"))
.sort((a, b)=>((a.propId === b.propId)? 0 : ((a.propId > b.propId)? 1 : -1)));
const trackPropLocations = data.propLocations.filter(m=>(typeof m.trackId !== "undefined"))
.sort((a, b)=>((a.trackId === b.trackId)? 0 : ((a.trackId > b.trackId)? 1 : -1)));
const textureRects = data.propTextureRects.filter(m=>(typeof m.textureId !== "undefined"))
.sort((a, b)=>((a.textureId === b.textureId)? 0 : ((a.textureId > b.textureId)? 1 : -1)));
// The assumed width of the prop texture atlas.
const textureAtlasWidth = 128;
// Pre-compute the individual prop textures.
const prebakedPropTextures = (new Array(textureRects.length)).fill().map((tex, idx)=>generate_prop_texture(idx));
// Pre-compute prop meshes. Each mesh will be an object with the following form:
//
//     {
//         ngons:
//         [
//             {
//                 fill:
//                 {
//                     type: "color" | "texture",
//                     idx: ...
//                 }
//                 vertices:
//                 [
//                     {x: ..., y: ..., z: ...},
//                     {x: ..., y: ..., z: ...},
//                     {x: ..., y: ..., z: ...},
//                     ...
//                 ]
//             },
//             {
//                 fill: {type: ..., idx: ...}
//                 vertices: [{...}]
//             },
//             ...
//         ]
//     }
//
// That is, each mesh consists of one or more n-gons, which themselves consist of
// a fill property, which describes whether the n-gon should be filled with a solid
// color or a texture (the fill.idx property defines either the color's palette index
// or the texture's index, depending on the fill type); and a list of the n vertices
// that define the n-gon.
//
const prebakedPropMeshes = (new Array(propMeshes.length)).fill().map((mesh, idx)=>
{
const ngons = propMeshes[idx].ngons.map(ngon=>
{
const meshNgon =
{
fill: Object.freeze(
{
type: ngon.fill.type.slice(),
idx: ngon.fill.idx
}),
vertices: ngon.vertices.map(vert=>(Object.freeze(
{
x: vert.x,
y: -vert.y,
z: -vert.z
}))),
};
Object.freeze(meshNgon.vertices);
return meshNgon;
});
// Pre-sort the mesh's ngons by depth, so that during rendering, we don't need to depth-
// sort them every frame.
ngons.sort((ngonA, ngonB)=>
{
const depthA = ngonA.vertices.reduce((depth, z)=>(depth + z)) / ngonA.vertices.length;
const depthB = ngonB.vertices.reduce((depth, z)=>(depth + z)) / ngonB.vertices.length;
return ((depthA === depthB)? 0 : ((depthA < depthB)? 1 : -1));
});
return {ngons};
});
const publicInterface =
{
mesh: Object.freeze(prebakedPropMeshes),
texture: prebakedPropTextures,
// Copies the given texture's data over the prop texture at the given index.
// This causes the current texture to be re-generated; a reference to the
// new texture object is returned.
copy_texture_data: function(textureIdx = 0, srcTexture)
{
Rsed.throw_if_not_type("number", textureIdx);
if ((srcTexture.width !== textureRects[textureIdx].rect.width) ||
(srcTexture.height !== textureRects[textureIdx].rect.height))
{
Rsed.throw("Invalid prop texture dimensions for copying.")
}
for (let y = 0; y < srcTexture.height; y++)
{
for (let x = 0; x < srcTexture.width; x++)
{
const dataIdx = ((textureRects[textureIdx].rect.topLeft.x + x) +
(textureRects[textureIdx].rect.topLeft.y + y) *
textureAtlasWidth);
textureAtlas[dataIdx] = srcTexture.indices[x + y * srcTexture.width];
}
}
// Regenerate this texture to incorporate the changes we've made to the
// master data array.
prebakedPropTextures[textureIdx] = generate_prop_texture(textureIdx);
return prebakedPropTextures[textureIdx];
},
name: (propId = 0)=>
{
Rsed.assert && ((propId >= 0) &&
(propId < propMeshes.length))
|| Rsed.throw("Querying a prop mesh out of bounds (" + propId + ").");
return propNames[propId].name;
},
names: ()=>
{
return propNames.map(nameObj=>nameObj.name);
},
// Returns the id of a prop with the supplied name. Throws if no such prop was found.
id_for_name: (propName = "")=>
{
const idx = propNames.map(nameObj=>nameObj.name).indexOf(propName);
Rsed.assert && (idx !== -1)
|| Rsed.throw("Failed to find a prop called " + propName + ".");
return propNames[idx].propId;
},
// Moves the propIdx'th prop on the given track by the given delta.
move: (trackId = 0, propIdx = 0, delta = {x:0,y:0,z:0})=>
{
Rsed.assert && ((trackId >= 0) &&
(trackId <= 7))
|| Rsed.throw("Querying a track out of bounds.");
Rsed.assert && ((propIdx >= 0) &&
(propIdx < trackPropLocations[trackId].locations.length))
|| Rsed.throw("Querying a prop location out of bounds.");
const currentLocation = trackPropLocations[trackId].locations[propIdx];
delta =
{
...{x:0,y:0,z:0},
...delta,
};
currentLocation.x = clamped_to_prop_margins(currentLocation.x + delta.x);
currentLocation.y = (currentLocation.y + delta.y);
currentLocation.z = clamped_to_prop_margins(currentLocation.z + delta.z);
},
remove: (trackId = 0, propIdx = 0)=>
{
Rsed.assert && ((trackId >= 0) &&
(trackId <= 7))
|| Rsed.throw("Querying a track out of bounds.");
Rsed.assert && ((propIdx >= 0) &&
(propIdx < trackPropLocations[trackId].locations.length))
|| Rsed.throw("Querying a prop location out of bounds.");
/// TODO: Finish lines should not be user-removable; so we do a little string comparison
/// kludge to ensure that doesn't happen. A more elegant implementation would ideally
/// be substituted.
if (propNames[trackPropLocations[trackId].locations[propIdx].propId].name.startsWith("finish"))
{
Rsed.alert("The finish line can't be removed.");
// Prevent the same input from registering again next frame, before
// the user has had time to release the mouse button.
Rsed.ui.inputState.reset_mouse_buttons_state();
return;
}
trackPropLocations[trackId].locations.splice(propIdx, 1);
},
// Assigns a new location to the propIdx'th prop on the given track.
set_prop_location: (trackId = 0, propIdx = 0, location = {x:0,y:0,z:0})=>
{
Rsed.assert && ((trackId >= 0) &&
(trackId <= 7))
|| Rsed.throw("Querying a track out of bounds.");
Rsed.assert && ((propIdx >= 0) &&
(propIdx < trackPropLocations[trackId].locations.length))
|| Rsed.throw("Querying a prop location out of bounds.");
location =
{
...
{
x: trackPropLocations[trackId].locations[propIdx].x,
y: trackPropLocations[trackId].locations[propIdx].y,
z: trackPropLocations[trackId].locations[propIdx].z,
},
...location,
}
trackPropLocations[trackId].locations[propIdx].x = location.x;
trackPropLocations[trackId].locations[propIdx].y = location.y;
trackPropLocations[trackId].locations[propIdx].z = location.z;
},
// Set the number of props on the given track. Props whose index value is higher than this
// count will be deleted. Note that this function is for RallySportED Loader pre-v.5.
set_count: (trackId = 0, newPropCount = 0)=>
{
Rsed.assert && ((trackId >= 0) &&
(trackId <= 7))
|| Rsed.throw("Querying a track out of bounds.");
Rsed.assert && ((newPropCount >= 1) &&
(newPropCount <= trackPropLocations[trackId].locations.length))
|| Rsed.throw("Trying to set a new prop count out of bounds.");
trackPropLocations[trackId].locations.length = newPropCount;
},
// Set the number of props on the given track. For RallySportED Loader v.5.
set_count__loader_v5: (trackId = 0, newPropCount = 0)=>
{
Rsed.assert && ((trackId >= 0) &&
(trackId <= 7))
|| Rsed.throw("Querying a track out of bounds.");
Rsed.assert && ((newPropCount >= 1) &&
(newPropCount <= Rsed.constants.maxPropCount))
|| Rsed.throw("Trying to set a new prop count out of bounds.");
trackPropLocations[trackId].locations = new Array(newPropCount).fill().map(e=>({x:0, y:0, z:0, propId: 0}));
},
reset_count: (trackId = 0)=>
{
Rsed.assert && ((trackId >= 0) &&
(trackId <= 7))
|| Rsed.throw("Querying a track out of bounds.");
trackPropLocations[trackId].locations.length = 0;
},
change_prop_type: (trackId = 0, propIdx = 0, newPropId = 0)=>
{
Rsed.assert && ((trackId >= 0) &&
(trackId <= 7))
|| Rsed.throw("Querying a track out of bounds.");
Rsed.assert && ((propIdx >= 0) &&
(propIdx < trackPropLocations[trackId].locations.length))
|| Rsed.throw("Querying a prop location out of bounds.");
trackPropLocations[trackId].locations[propIdx].propId = newPropId;
},
num_props_on_track: (trackId = 0)=>
{
return trackPropLocations[trackId].locations.length;
},
add_location: (trackId = 0, newPropId = 0, location = {x:0,y:0,z:0})=>
{
if (trackPropLocations[trackId].locations.length >= Rsed.constants.maxPropCount)
{
Rsed.alert("All prop slots are already in use.");
return;
}
Rsed.assert && ((trackId >= 0) &&
(trackId <= 7))
|| Rsed.throw("Querying a track out of bounds.");
Rsed.assert && ((newPropId >= 0) &&
(newPropId < propNames.length))
|| Rsed.throw("Querying a prop id out of bounds.");
location =
{
...
{
x: 0,
y: 0,
z: 0,
},
...location,
}
trackPropLocations[trackId].locations.push(
{
propId: newPropId,
x: clamped_to_prop_margins(location.x),
y: location.y,
z: clamped_to_prop_margins(location.z),
});
},
// Returns by value the locations of all the props on the given track.
locations_of_props_on_track: (trackId = 0)=>
{
Rsed.assert && ((trackId >= 0) &&
(trackId <= 7))
|| Rsed.throw("Querying a track out of bounds.");
return Object.freeze(trackPropLocations[trackId].locations.map(loc=>(
{
propId: loc.propId,
x: loc.x,
y: loc.y,
z: loc.z
})));
},
};
return publicInterface;
function generate_prop_texture(idx)
{
const width = textureRects[idx].rect.width;
const height = textureRects[idx].rect.height;
const pixels = [];
const indices = [];
// Copy the texture's pixel region from the texture atlas.
for (let y = 0; y < height; y++)
{
for (let x = 0; x < width; x++)
{
const dataIdx = ((textureRects[idx].rect.topLeft.x + x) + (textureRects[idx].rect.topLeft.y + y) * textureAtlasWidth);
indices.push(textureAtlas[dataIdx]);
pixels.push(Rsed.visual.palette.color_at_idx(textureAtlas[dataIdx], true));
}
}
return Rsed.visual.texture(
{
width,
height,
pixels: pixels,
indices: indices,
flipped: "no",
assetId: idx,
assetType: "props",
set_pixel_at: function(x = 0, y = 0, newColorIdx = 0)
{
const texelIdx = ((textureRects[idx].rect.topLeft.x + x) +
(textureRects[idx].rect.topLeft.y + y) *
textureAtlasWidth);
textureAtlas[texelIdx] = newColorIdx;
// Regenerate this texture to incorporate the changes we've made to the
// master data array.
prebakedPropTextures[idx] = generate_prop_texture(idx);
// Return the updated reference to this texture:
return prebakedPropTextures[idx];
},
});
}
// Clamp the given value (expected to be track tile units) so that it doesn't exceed the
// track prop margins. (E.g. if the track is 128 tiles wide and the margin is 2 tiles, a
// value of 132 would be clamped to 126; and a value of -5 to 2.)
function clamped_to_prop_margins(value)
{
const min = (Rsed.constants.propTileMargin * Rsed.constants.groundTileSize);
const max = ((Rsed.core.current_project().maasto.width - Rsed.constants.propTileMargin) * Rsed.constants.groundTileSize);
return Rsed.clamp(value, min, max);
}
// Prop metadata includes vertex data, texture UV coordinates, display names, etc. of
// track props.
async function fetch_prop_metadata_from_server()
{
return fetch("./client/assets/track-props.json")
.then(response=>
{
if (response.status !== 200)
{
throw "Failed to fetch prop metadata from the RallySportED-js server.";
}
return response.json();
})
.catch(error=>{ Rsed.throw(error); });
}
}
/*
* Most recent known filename: js/ui/asset-mutator.js
*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// A layer that sits between the user and the game assets (heightmap, tilemap, textures,
// etc.), registering and routing all commands from the user to modify those assets. This
// is to ensure that all user-initiated modifications are inserted into the undo/redo
// stack, transmitted through the network in shared editing mode, etc.
//
// WARNING: If a particular mutation of asset is not available via this layer, the user
// should not be allowed to perform it even if the asset object itself provides a direct
// function for that mutation. For instance, the layer doesn't provide a way to set the
// number of track props even though it could be done via project.props.set_count(); so
// the user should instead be made to act via the layer's "add" and "remove" prop actions,
// or the layer should be expanded to allow specific manipulation of the prop count.
Rsed.ui.assetMutator = (function()
{
const publicInterface = {
// Call this function when the user requests (e.g. via the UI) to perform a
// mutation on an asset - e.g. to paint the tilemap, alter the heightmap, etc.
//
// 'assetType' identifies which class of asset is to be edited. Valid values
// are "maasto" (heightmap), "varimaa" (tilemap), "texture", and "prop".
//
// 'editAction' defines the action to be performed on the asset; being an
// object of the following form:
//
//   {
//       command: A string enumerator identifying the edit action to be performed wrt. the asset
//       target: A property identifying the specific instance of asset to be acted in regard to
//       data: A payload associated with the action - e.g. a new height value to modify the heightmap with
//   }
//
// You can find which 'editAction' parameters are valid for a given class of
// asset by inspecting the applicator functions.
user_edit: (assetType = "", editAction = {})=>
{
if (!Object.keys(applicators).includes(assetType))
{
Rsed.throw("Unknown asset type.");
}
const result = applicators[assetType](Rsed.core.current_project(), editAction);
return result;
}
}
// For each class of asset, a function that applies a user-requested mutation on
// the asset.
const applicators = {
"maasto": (project, edit)=>
{
Rsed.ui.undoStack.mark_dirty_ground_tile(edit.target.x, edit.target.y);
switch (edit.command)
{
case "set-height":
{
project.maasto.set_tile_value_at(edit.target.x, edit.target.y, edit.data);
break;
}
default: Rsed.throw("Unknown edit action."); break;
}
},
"varimaa": (project, edit)=>
{
Rsed.ui.undoStack.mark_dirty_ground_tile(edit.target.x, edit.target.y);
switch (edit.command)
{
case "set-tile":
{
project.varimaa.set_tile_value_at(edit.target.x, edit.target.y, edit.data);
break;
}
default: Rsed.throw("Unknown edit action."); break;
}
},
"texture": (project, edit)=>
{
Rsed.ui.undoStack.mark_dirty_texture(edit.target.texture.args.assetType, edit.target.texture.args.assetId);
switch (edit.command)
{
case "set-pixel":
{
// Returns the new modified texture.
return edit.target.texture.set_pixel_at(edit.target.u, edit.target.v, edit.data);
}
case "set-all-pixels":
{
let texture = edit.target.texture;
Rsed.throw_if(edit.data.length != (texture.width * texture.height));
for (let y = 0; y < texture.height; y++)
{
for (let x = 0; x < texture.width; x++)
{
// Note: Modifying the texture causes it to be regenerated as a new
// object, so we need to keep track of it.
texture = texture.set_pixel_at(x, y, edit.data[x + y * texture.width]);
}
}
// Returns the new modified texture.
return texture;
}
default: Rsed.throw("Unknown edit action."); break;
}
},
"prop": (project, edit)=>
{
const trackId = project.track_id();
const propIdx = edit.target;
Rsed.ui.undoStack.mark_dirty_props();
switch (edit.command)
{
case "move":
{
project.props.move(trackId, propIdx, edit.data);
break;
}
case "remove":
{
project.props.remove(trackId, propIdx);
break;
}
case "set-type":
{
project.props.change_prop_type(trackId, propIdx, edit.data);
break;
}
case "add":
{
project.props.add_location(trackId, propIdx, edit.data);
break;
}
default: Rsed.throw("Unknown edit action."); break;
}
}
}
return publicInterface;
})();
/*
* Most recent known filename: js/ui/undo-stack.js
*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// An undo/redo system.
//
// The system keeps track of the user's track edits (like altering ground height, moving
// props, etc.), and stores them in 'undo levels'.
//
// An undo level starts when the user makes an edit, and ends when they release all mouse
// buttons (it's assumed that only mouse buttons can be used to make track edits). This
// undo level will then consist of any track edits the user made in that time.
//
// To undo the most recent edits, you'd call undo(). And, provided that the user hasn't
// made any new edits since that call to undo(), you can re-do the edits by calling redo().
//
// Making new edits after calling undo() will cause the undo levels above it to be erased
// and replaced with one or more new levels reflecting the new edits.
Rsed.ui.undoStack = (function()
{
// While true, no new new undo levels can be added.
let frozen = false;
// We'll use a timer (setInterval()) to decide when to seal the current undo level
// once it has been created.
let timerId = null;
// Track data as it were before the current undo level for any track elements
// that are modified by this undo level.
let dirtyGround = [];
let dirtyProps = [];
let dirtyTextures = [];
// We'll keep track of which undo level's data has been saved so RallySportED-js
// can indicate to the user whether the project's current state is saved or not.
let lastSavedUndoLevelId = undefined;
// All undo levels we've recorded since they were last reset. Note that if the user
// undoes and then makes new changes, the undo levels above that point will be
// replaced with new undo levels that reflect the new changes.
const undoLevels = [];
// The index in 'undoLevels' that we're currently at. If the user hasn't undone
// anything, this will be the total count of undo levels; otherwise, this is moved
// back (down) each time the user undoes, and forward (up) when the user redoes.
let undoLevelHead = 0;
function create_undo_level()
{
// If we already have an active group.
if (timerId !== null)
{
return;
}
timerId = setInterval(seal_undo_level, 1);
}
// Marks all changes made since starting the current undo level as
// belonging to that undo level.
function seal_undo_level()
{
if (!timerId)
{
Rsed.throw("Attempting to seal a nonexistent undo level.");
}
if (Rsed.ui.inputState.mouse_button_down())
{
return;
}
clearInterval(timerId);
timerId = null;
undoLevels.length = (undoLevelHead + 1);
// Ground data after this undo level's changes are made.
const groundAfter = [];
for (tile of Object.keys(dirtyGround))
{
const x = dirtyGround[tile].x;
const y = dirtyGround[tile].y;
groundAfter[tile] = {
x,
y,
height: Rsed.core.current_project().maasto.tile_at(x, y),
palaIdx: Rsed.core.current_project().varimaa.tile_at(x, y),
};
}
// Prop data after this undo level's changes are made.
const propsAfter = Rsed.core.current_project().props.locations_of_props_on_track(Rsed.core.current_project().trackId);
// Texture data after this undo level's changes are made.
const texturesAfter = [];
for (textureId of Object.keys(dirtyTextures))
{
// We expect the texture id to be of the form "<type> <value>", e.g.
// "palat 97" for PALA texture #97.
const [textureType, textureIndex] = textureId.split(" ");
texturesAfter[textureId] = Rsed.core.current_project()[textureType].texture[textureIndex];
}
undoLevels[undoLevelHead] = {
id: Rsed.uuid.generate_v4(),
before: {
ground: dirtyGround,
props: dirtyProps,
textures: dirtyTextures,
},
after: {
ground: groundAfter,
props: propsAfter,
textures: texturesAfter,
}
};
undoLevelHead++;
dirtyGround = [];
dirtyProps = [];
dirtyTextures = [];
// Let the user know that they have unsaved changes.
Rsed.ui.htmlUI.refresh();
}
// Undo the changes in the current undo level if when == "before", or redo
// the current undo level's changes if when == "after".
function apply_undo_level(undoLevel, when = "before")
{
if (!undoLevel)
{
return;
}
// Don't allow undo while an action group is being recorded.
if (timerId !== null)
{
return;
}
frozen = true;
// Undo on ground tiles.
for (tile of Object.keys(undoLevel[when].ground))
{
Rsed.core.current_project().maasto.set_tile_value_at(undoLevel[when].ground[tile].x,
undoLevel[when].ground[tile].y,
undoLevel[when].ground[tile].height);
Rsed.core.current_project().varimaa.set_tile_value_at(undoLevel[when].ground[tile].x,
undoLevel[when].ground[tile].y,
undoLevel[when].ground[tile].palaIdx);
}
// Undo on props.
if (undoLevel[when].props.length)
{
const trackId = Rsed.core.current_project().trackId;
Rsed.core.current_project().props.set_count__loader_v5(trackId, undoLevel[when].props.length);
for (let i = 0; i < undoLevel[when].props.length; i++)
{
Rsed.core.current_project().props.set_prop_location(trackId, i, {
x: undoLevel[when].props[i].x,
y: undoLevel[when].props[i].y,
z: undoLevel[when].props[i].z,
});
Rsed.core.current_project().props.change_prop_type(trackId, i, undoLevel[when].props[i].propId);
}
}
// Undo on textures.
for (textureId of Object.keys(undoLevel[when].textures))
{
// We expect the texture id to be of the form "<type> <value>", e.g.
// "palat 97" for PALA texture #97.
const [textureType, textureIndex] = textureId.split(" ");
// Update the texture's data. We'll get back a reference to the updated
// texture object.
const updatedTexture = Rsed.core.current_project()[textureType]
.copy_texture_data(Number(textureIndex),
undoLevel[when].textures[textureId]);
// The texture-editing view doesn't automatically update its texture
// reference, so we'll need to let it known the texture has changed.
if (Rsed.core.current_scene() == Rsed.scenes["texture"])
{
Rsed.scenes["texture"].set_texture(updatedTexture);
}
}
frozen = false;
}
const publicInterface =
{
is_current_undo_level_saved: function()
{
return (lastSavedUndoLevelId === publicInterface.current_undo_level_id());
},
mark_current_undo_level_as_saved: function()
{
lastSavedUndoLevelId = publicInterface.current_undo_level_id();
},
current_undo_level_id: function()
{
return (undoLevels[undoLevelHead - 1]? undoLevels[undoLevelHead - 1].id : undefined);
},
// Removes all undo levels.
reset: function()
{
frozen = false;
timerId = null;
dirtyGround = [];
dirtyProps = [];
dirtyTextures = [];
undoLevels.length = 0;
undoLevelHead = 0;
lastSavedUndoLevelId = undefined;
},
// Undoes the latest level.
undo: function()
{
if (frozen || Rsed.ui.inputState.mouse_button_down())
{
return;
}
// If no more undo levels.
if (undoLevelHead <= 0)
{
return;
}
undoLevelHead--;
apply_undo_level(undoLevels[undoLevelHead], "before");
Rsed.ui.htmlUI.refresh();
},
// Redoes the latest level.
redo: function()
{
if (frozen || Rsed.ui.inputState.mouse_button_down())
{
return;
}
// If no more undo levels.
if (undoLevelHead >= undoLevels.length)
{
return;
}
apply_undo_level(undoLevels[undoLevelHead], "after");
undoLevelHead++;
Rsed.ui.htmlUI.refresh();
},
// For the given XY ground tile, marks its height and texture index at
// the beginning of the current undo level.
mark_dirty_ground_tile: function(x = 0, y = 0)
{
Rsed.throw_if_not_type("number", x, y);
if (frozen || Rsed.core.current_project().isPlaceholder)
{
return;
}
create_undo_level();
if (typeof dirtyGround[`${x} ${y}`] === "undefined")
{
dirtyGround[`${x} ${y}`] = {
x,
y,
height: Rsed.core.current_project().maasto.tile_at(x, y),
palaIdx: Rsed.core.current_project().varimaa.tile_at(x, y),
};
}
},
// Stores all of the current track's prop info at the beginning of the
// current undo level.
mark_dirty_props: function()
{
if (frozen || Rsed.core.current_project().isPlaceholder)
{
return;
}
// If we've already stored the prop info for the current undo level.
if (dirtyProps.length)
{
return;
}
create_undo_level();
dirtyProps = Rsed.core.current_project().props.locations_of_props_on_track(Rsed.core.current_project().trackId);
},
// Stores the data of the given texture at the beginning of the current undo
// level.
mark_dirty_texture: function(textureType = "", palaIdx = 0)
{
if (frozen || Rsed.core.current_project().isPlaceholder)
{
return;
}
Rsed.throw_if_not_type("number", palaIdx);
if (!["props", "palat"].includes(textureType))
{
Rsed.throw("Unknown texture type.");
}
create_undo_level();
if (typeof dirtyTextures[`${textureType} ${palaIdx}`] === "undefined")
{
dirtyTextures[`${textureType} ${palaIdx}`] = Rsed.core.current_project()[textureType].texture[palaIdx];
}
},
};
publicInterface.reset();
return publicInterface;
})();
/*
* Most recent known filename: js/ui/html.js
*
* Tarpeeksi Hyvae Soft 2018 /
* RallySportED-js
*
*/
"use strict";
// Provides functionality to manage RallySportED-js's HTML (Vue) UI.
//
// Note: This will likely be rewritten in the near future. Vue is a bit
// of a bolt-on in this project at the moment.
//
Rsed.ui.htmlUI = (function()
{
const uiContainer = new Vue(
{
el: "#html-ui",
data:
{
// The display name of the track that's currently open in the editor.
trackName: "",
propList: [],
// Whether the UI should be displayed or kept invisible at this time.
uiVisible: false,
// For Rsed.stream().
streamStatus: "disabled",
streamViewerCount: 0,
},
methods:
{
// Called when the user selects a prop from the prop dropdown menu.
/// TODO: Needs to be somewhere more suitable, and named something more descriptive.
activate_prop: function(name = "")
{
if (!Rsed.ui.inputState.current_mouse_hover() ||
Rsed.ui.inputState.current_mouse_hover().type !== "prop")
{
return;
}
Rsed.ui.assetMutator.user_edit("prop", {
command: "set-type",
target: Rsed.ui.inputState.current_mouse_hover().propTrackIdx,
data: Rsed.core.current_project().props.id_for_name(name),
});
window.close_dropdowns();
return;
},
refresh_prop_list: function(forFinishLines = false)
{
this.propList = Rsed.core.current_project().props.names()
.filter(propName=>(forFinishLines? propName.startsWith("finish") : !propName.startsWith("finish")))
.map(propName=>({propName}));
return;
},
refresh_track_name: function()
{
this.trackName = Rsed.core.current_project().name;
return;
},
}
});
const publicInterface = {
refresh_prop_list: function(forFinishLines = false)
{
uiContainer.refresh_prop_list(forFinishLines)
},
refresh: function()
{
uiContainer.refresh_track_name();
if ((typeof Rsed.core.current_project().name == "string") &&
Rsed.core.current_project().name.length)
{
document.title = `${Rsed.core.current_project().areAllChangesSaved? "" : "* "}
${Rsed.core.current_project().name} -
${Rsed.core.appName}`;
}
else
{
document.title = Rsed.core.appName;
}
},
set_visible: function(isVisible)
{
uiContainer.uiVisible = isVisible;
},
set_stream_status: function(status)
{
uiContainer.streamStatus = status;
},
set_stream_viewer_count: function(num)
{
uiContainer.streamViewerCount = num;
},
display_blue_screen: function(errorMessage = "")
{
if ((typeof errorMessage !== "string") ||
!errorMessage.length)
{
errorMessage = "Unspecified error";
}
uiContainer.uiVisible = false;
document.getElementById("blue-screen").style.display = "flex";
document.querySelector("#blue-screen #error-description").innerHTML = errorMessage;
},
};
return publicInterface;
})();
/*
* Most recent known filename: js/ui/font.js
*
* 2018-2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
Rsed.ui.font = (function()
{
// Shorthands for colors.
const X = "black";
const _ = "background";
const charset = {
" ": c([[_]]),
"!": c([[X],
[X],
[X],
[_],
[X]]),
"?": c([[X,X,_],
[_,_,X],
[_,X,_],
[_,_,_],
[_,X,_]]),
"\"": c([[_,X,_,X],
[_,X,_,X],
[X,_,X,_]]),
"#": c([[_,X,_,X,_],
[X,X,X,X,X],
[_,X,_,X,_],
[X,X,X,X,X],
[_,X,_,X,_]]),
"(": c([[_,X],
[X,_],
[X,_],
[X,_],
[_,X]]),
")": c([[X,_],
[_,X],
[_,X],
[_,X],
[X,_]]),
"*": c([[X,_,X],
[_,X,_],
[X,_,X]], {y: 1}),
"/": c([[_,_,X],
[_,_,X],
[_,X,_],
[X,_,_],
[X,_,_]]),
"+": c([[_,X,_],
[X,X,X],
[_,X,_]], {y: 1}),
"-": c([[X,X,X]], {y: 2}),
".": c([[X]], {y: 4}),
",": c([[_,X],
[X,_]], {y: 3}),
":": c([[X],
[_],
[X]], {y: 1}),
";": c([[_,X],
[_,_],
[_,X],
[X,_]], {y: 1}),
"<": c([[_,X],
[X,_],
[_,X]], {y: 1}),
">": c([[X,_],
[_,X],
[X,_]], {y: 1}),
"=": c([[X,X,X],
[_,_,_],
[X,X,X]], {y: 1}),
"_": c([[X,X,X]], {y: 3}),
"0": c([[_,X,_],
[X,_,X],
[X,_,X],
[X,_,X],
[_,X,_]]),
"1": c([[_,_,X],
[_,X,X],
[_,_,X],
[_,_,X],
[_,_,X]], {x: -1}),
"2": c([[_,X,_],
[X,_,X],
[_,_,X],
[_,X,_],
[X,X,X]]),
"3": c([[X,X,_],
[_,_,X],
[_,X,_],
[_,_,X],
[X,X,_]]),
"4": c([[_,_,X],
[_,X,X],
[X,_,X],
[X,X,X],
[_,_,X]]),
"5": c([[X,X,X],
[X,_,_],
[X,X,_],
[_,_,X],
[X,X,_]]),
"6": c([[_,X,X],
[X,_,_],
[X,X,_],
[X,_,X],
[_,X,_]]),
"7": c([[X,X,X],
[_,_,X],
[_,X,_],
[_,X,_],
[_,X,_]]),
"8": c([[_,X,_],
[X,_,X],
[_,X,_],
[X,_,X],
[_,X,_]]),
"9": c([[_,X,_],
[X,_,X],
[_,X,X],
[_,_,X],
[_,X,_]]),
"A": c([[_,X,_],
[X,_,X],
[X,X,X],
[X,_,X],
[X,_,X]]),
"B": c([[X,X,_],
[X,_,X],
[X,X,_],
[X,_,X],
[X,X,_]]),
"C": c([[_,X,X],
[X,_,_],
[X,_,_],
[X,_,_],
[_,X,X]]),
"D": c([[X,X,_],
[X,_,X],
[X,_,X],
[X,_,X],
[X,X,_]]),
"E": c([[_,X,X],
[X,_,_],
[X,X,X],
[X,_,_],
[_,X,X]]),
"F": c([[_,X,X],
[X,_,_],
[X,X,_],
[X,_,_],
[X,_,_]]),
"G": c([[_,X,X],
[X,_,_],
[X,_,X],
[X,_,X],
[_,X,X]]),
"H": c([[X,_,X],
[X,_,X],
[X,X,X],
[X,_,X],
[X,_,X]]),
"I": c([[X,X,X],
[_,X,_],
[_,X,_],
[_,X,_],
[X,X,X]]),
"J": c([[_,X,X],
[_,_,X],
[_,_,X],
[X,_,X],
[_,X,_]]),
"K": c([[X,_,X],
[X,_,X],
[X,X,_],
[X,_,X],
[X,_,X]]),
"L": c([[X,_,_],
[X,_,_],
[X,_,_],
[X,_,_],
[_,X,X]]),
"M": c([[X,X,_,X,_],
[X,_,X,_,X],
[X,_,X,_,X],
[X,_,X,_,X],
[X,_,X,_,X]]),
"N": c([[X,X,_],
[X,_,X],
[X,_,X],
[X,_,X],
[X,_,X]]),
"O": c([[_,X,_],
[X,_,X],
[X,_,X],
[X,_,X],
[_,X,_]]),
"P": c([[X,X,_],
[X,_,X],
[X,X,_],
[X,_,_],
[X,_,_]]),
"Q": c([[_,X,_],
[X,_,X],
[X,_,X],
[X,_,X],
[_,X,X],
[_,_,X]]),
"R": c([[X,X,_],
[X,_,X],
[X,X,_],
[X,_,X],
[X,_,X]]),
"S": c([[_,X,X],
[X,_,_],
[_,X,_],
[_,_,X],
[X,X,_]]),
"T": c([[X,X,X],
[_,X,_],
[_,X,_],
[_,X,_],
[_,X,_]]),
"U": c([[X,_,X],
[X,_,X],
[X,_,X],
[X,_,X],
[_,X,X]]),
"W": c([[_,_,_,_,X],
[X,_,X,_,X],
[X,_,X,_,X],
[X,_,X,_,X],
[_,X,_,X,_]]),
"X": c([[X,_,X],
[X,_,X],
[_,X,_],
[X,_,X],
[X,_,X]]),
"Y": c([[X,_,X],
[X,_,X],
[_,X,_],
[_,X,_],
[_,X,_]]),
"Z": c([[X,X,X],
[_,_,X],
[_,X,_],
[X,_,_],
[X,X,X]]),
};
const publicInterface = Object.freeze({
nativeHeight: 5,
character: function(ch = "?")
{
return (charset[ch] ||
c([[X,_,X,_],
[_,X,_,X],
[X,_,X,_],
[_,X,_,X],
[X,_,X,_]]));
},
width_in_pixels: function(string = "A", characterSpacing = 1)
{
Rsed.throw_if_not_type("string", string);
Rsed.throw_if(!string.length);
const combinedCharacterWidth = Array.from(string).reduce((width, ch)=>(width + publicInterface.character(ch).width), 0);
return (combinedCharacterWidth + (characterSpacing * (string.length - 1)));
}
});
return publicInterface;
// Creates and returns a new character object.
function c(pixels = [[],[],], options = {})
{
Rsed.throw_if_not_type("array", pixels);
const width = pixels[0].length;
const height = pixels.length;
Rsed.throw_if(pixels.some(line=>(line.length != width)), "Malformed character bitmap.");
options = {
...{
x: 0,
y: 0,
},
...options
};
return Object.freeze({
width,
height,
offsetX: options.x,
offsetY: options.y,
pixel_at: function(x = 0, y = 0)
{
x -= this.offsetX;
y -= this.offsetY;
if((x < 0) ||
(y < 0) ||
(x >= width) ||
(y >= height))
{
return undefined;
}
return pixels[y][x];
},
});
}
})();
/*
* Most recent known filename: js/ui/ground-brush.js
*
* Tarpeeksi Hyvae Soft 2018 /
* RallySportED-js
*
*/
"use strict";
// A brush used to edit the current project's heightmap and tilemap.
Rsed.ui.groundBrush = (function()
{
// How large of a radius the brush paints with. A value of 0 means one tile.
let brushSize = 0;
// Which PALA texture the brush paints with, currently.
let brushPalaIdx = 3;
const publicInterface = {};
{
// Set to true to have the brush smoothen the terrain heightmap.
publicInterface.brushSmoothens = false;
publicInterface.brushAction = Object.freeze({void:0, changeHeight:1, changePala:2, smoothenGround:3});
// Modify the terrain at the given x,y coordinates with the given brush action.
publicInterface.apply_brush_to_terrain = function(brushAction = 0, value = 0, x = 0, y = 0)
{
const targetProject = Rsed.core.current_project();
for (let by = -brushSize; by <= brushSize; by++)
{
const tileZ = (y + by);
if ((tileZ < 0) || (tileZ >= targetProject.maasto.width)) continue;
for (let bx = -brushSize; bx <= brushSize; bx++)
{
const tileX = (x + bx);
if ((tileX < 0) || (tileX >= targetProject.maasto.width)) continue;
switch (brushAction)
{
case this.brushAction.changeHeight:
{
if (this.brushSmoothens)
{
if ((tileX < 1) || (tileX >= (targetProject.maasto.width - 1))) continue;
if ((tileZ < 1) || (tileZ >= (targetProject.maasto.width - 1))) continue;
let avgHeight = 0;
avgHeight += targetProject.maasto.tile_at(tileX+1, tileZ);
avgHeight += targetProject.maasto.tile_at(tileX-1, tileZ);
avgHeight += targetProject.maasto.tile_at(tileX,   tileZ+1);
avgHeight += targetProject.maasto.tile_at(tileX,   tileZ-1);
avgHeight += targetProject.maasto.tile_at(tileX+1, tileZ+1);
avgHeight += targetProject.maasto.tile_at(tileX+1, tileZ-1);
avgHeight += targetProject.maasto.tile_at(tileX-1, tileZ+1);
avgHeight += targetProject.maasto.tile_at(tileX-1, tileZ-1);
avgHeight /= 8;
Rsed.ui.assetMutator.user_edit("maasto",{
command: "set-height",
target: {x: tileX, y: tileZ},
data: Math.floor(((avgHeight + targetProject.maasto.tile_at(tileX, tileZ) * 7) / 8)),
});
}
else
{
Rsed.ui.assetMutator.user_edit("maasto", {
command: "set-height",
target: {x: tileX, y: tileZ},
data: (targetProject.maasto.tile_at(tileX, tileZ) + value),
});
}
break;
}
case this.brushAction.changePala:
{
Rsed.ui.assetMutator.user_edit("varimaa", {
command: "set-tile",
target: {x: tileX, y: tileZ},
data: value,
});
break;
}
default: Rsed.throw("Unknown brush action.");
}
}
}
}
publicInterface.set_brush_size = function(newSize = 0)
{
Rsed.assert && (newSize >= 0)
|| Rsed.throw("Attempted to set an invalid brush size.");
brushSize = newSize;
}
publicInterface.brush_size = function()
{
return brushSize;
}
publicInterface.set_brush_pala_idx = function(newPalaIdx = 0)
{
Rsed.assert && (newPalaIdx >= 0)
|| Rsed.throw("Attempted to set an invalid brush PALA index.");
brushPalaIdx = newPalaIdx;
}
publicInterface.brush_pala_idx = function()
{
return brushPalaIdx;
}
}
return publicInterface;
})();
/*
* Most recent known filename: js/ui/cursor-handler.js
*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
Rsed.ui.cursorHandler = (function()
{
let currentCursor = undefined;
const cursors = {
arrow: "./client/assets/cursors/rsed-cursor-arrow.png",
openHand: "./client/assets/cursors/rsed-cursor-openhand.png",
openHand2: "./client/assets/cursors/rsed-cursor-openhand2.png",
fingerHand: "./client/assets/cursors/rsed-cursor-fingerhand.png",
closedHand: "./client/assets/cursors/rsed-cursor-closedhand.png",
groundSmoothing: "./client/assets/cursors/rsed-cursor-arrowsmooth.png",
blocked: "./client/assets/cursors/rsed-cursor-blocked.png",
eyedropper: "./client/assets/cursors/rsed-cursor-eyedropper.png",
pencil: "./client/assets/cursors/rsed-cursor-pencil.png",
default: undefined,
};
cursors.default = cursors.arrow;
// Pre-load the cursor images' data so they'll be immediately available for display
// when required.
const cursorImages = Object.keys(cursors).map(c=>{
const image = new Image();
image.src = cursors[c];
return image;
});
const publicInterface = {
cursors: Object.freeze(cursors),
set_cursor: function(cursor = cursors.default)
{
cursor = (cursor || cursors.default);
if (currentCursor === cursor)
{
return;
}
/// TODO: Chrome 86 (haven't tested other versions) seems to have some
/// trouble with setting the cursor in this way. Seems the image isn't
/// cached (so a new network request is fired every time the cursor
/// changes), and there may be some flickering when displaying it.
document.body.style.cursor = `url(${cursor}), auto`;
currentCursor = cursor;
return;
}
};
publicInterface.set_cursor(cursors.default);
return publicInterface;
})();
/*
* Most recent known filename: js/ui/draw.js
*
* Tarpeeksi Hyvae Soft 2018 /
* RallySportED-js
*
*/
"use strict";
// Handles rendering the RallySportED-js UI.
Rsed.ui.draw = (function()
{
// The pixel buffer that UI render commands will draw into.
let pixelSurface = null;
// The mouse-picking pixel buffer that UI render commands will write into.
let mousePickBuffer = null;
const publicInterface =
{
// Readies the pixel buffer for UI drawing. This should be called before any draw
// calls are made for the current frame.
begin_drawing: function(canvas)
{
Rsed.assert && (!pixelSurface &&
!mousePickBuffer)
|| Rsed.throw("Cannot begin drawing while the pixel buffer is already in use.");
pixelSurface = canvas.domElement.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
mousePickBuffer = canvas.mousePickingBuffer;
return;
},
// Uploads the current pixel buffer onto the target canvas. This should be called
// once all draw calls for the current frame have been made.
finish_drawing: function(canvas)
{
Rsed.assert && (pixelSurface &&
mousePickBuffer)
|| Rsed.throw("Cannot finish drawing when drawing hasn't begun.");
canvas.domElement.getContext("2d").putImageData(pixelSurface, 0, 0);
pixelSurface = null;
mousePickBuffer = null;
return;
},
pixel: function(x = 0, y = 0, r = 255, g = 255, b = 255, m = undefined)
{
const idx = ((x + y * Rsed.visual.canvas.width) * 4);
pixelSurface.data[idx + 0] = r;
pixelSurface.data[idx + 1] = g;
pixelSurface.data[idx + 2] = b;
pixelSurface.data[idx + 3] = 255;
if (m != undefined)
{
mousePickBuffer[(x + y * Rsed.visual.canvas.width)] = m;
}
return;
},
// Draws the given set of paletted pixels (each being a value in the range 0..31 in Rally-Sport's
// palette) of the given dimensions, starting at the x,y screen coordinates and working right/down.
// If alpha is true, will not draw pixels that have a palette index of 0.
image: function(pixels = [], mousePick = [], width = 0, height = 0, x = 0, y = 0, alpha = false, flipped = false)
{
// Convert from percentages into absolute screen coordinates.
if (x < 0) x = Math.floor(-x * pixelSurface.width);
if (y < 0) y = Math.floor(-y * pixelSurface.height);
x = Math.floor(x);
y = Math.floor(y);
Rsed.assert && ((mousePick instanceof Array) ||
(mousePick === null))
|| Rsed.throw("Expected a valid mouse-picking buffer.");
Rsed.assert && (pixelSurface != null)
|| Rsed.throw("Expected a valid pixel surface.");
Rsed.assert && ((pixels[0] != null) &&
(pixels.length > 0))
|| Rsed.throw("Expected a valid array of pixels.");
Rsed.assert && ((width  > 0) &&
(height > 0))
|| Rsed.throw("Expected a valid image resolution.");
for (let cy = 0; cy < height; cy++)
{
if ((y + cy) < 0) continue;
if ((y + cy) >= pixelSurface.height) break;
for (let cx = 0; cx < width; cx++)
{
if ((x + cx) < 0) continue;
if ((x + cx) >= pixelSurface.width) break;
const pixel = pixels[cx + (flipped? (height - cy - 1) : cy) * width];
if (alpha && (pixel === 0)) continue;
const color = ((typeof pixel === "object")? pixel : Rsed.visual.palette.color_at_idx(pixel));
this.pixel((x + cx), (y + cy), color.red, color.green, color.blue);
if (mousePick != null)
{
put_mouse_pick_value((x + cx), (y + cy), mousePick[cx + cy * width]);
}
}
}
return;
},
// Draws the given string onto the screen at the given coordinates.
// NOTE: If a coordinate's value is less than 0, its absolute value is interpreted as a percentage
// of the screen's resolution in the range 0..1.
string: function(string = "", x = 0, y = 0)
{
string = String(string).toUpperCase();
Rsed.assert && (pixelSurface != null)
|| Rsed.throw("Expected a valid pixel surface.");
Rsed.assert && (string.length != null)
|| Rsed.throw("Expected a non-empty string");
x = Math.floor(x);
y = Math.floor(y);
// Convert from percentages into absolute screen coordinates.
if (x < 0) x = Math.floor(-x * Rsed.visual.canvas.width);
if (y < 0) y = Math.floor(-y * Rsed.visual.canvas.height);
// Prevent the string from going past the viewport's edges.
x = Math.min(x, (Rsed.visual.canvas.width - 1 - Rsed.ui.font.width_in_pixels(string)));
y = Math.min(y, (Rsed.visual.canvas.height - Rsed.ui.font.nativeHeight - 2));
// Draw a left vertical border for the string block. The font's
// bitmap characters include bottom, right, and top borders, but
// not left; so we need to create the left one manually.
if ((x >= 0) && (x < Rsed.visual.canvas.width))
{
for (let i = 0; i < (Rsed.ui.font.nativeHeight + 2); i++)
{
this.pixel(x, y + i, 255, 255, 0);
}
x++;
}
// Draw the string, one character at a time.
for (let i = 0; i < string.length; i++)
{
const character = Rsed.ui.font.character(string[i]);
for (let cy = 0; cy < (Rsed.ui.font.nativeHeight + 2); cy++)
{
if ((y + cy) < 0) continue;
if ((y + cy) >= pixelSurface.height) break;
for (let cx = 0; cx <= character.width; cx++)
{
if ((x + cx) < 0) continue;
if ((x + cx) >= pixelSurface.width) break;
const color = character.pixel_at(cx, cy-1)
? Rsed.visual.palette.color_at_idx(character.pixel_at(cx, cy-1))
: Rsed.visual.palette.color_at_idx("background");
this.pixel((x + cx), (y + cy), color.red, color.green, color.blue);
}
}
x += (character.width + 1);
}
return;
},
};
function put_mouse_pick_value(x = 0, y = 0, value = 0)
{
mousePickBuffer[(x + y * pixelSurface.width)] = value;
return;
}
return publicInterface;
})();
/*
* Most recent known filename: js/ui/window.js
*
* Tarpeeksi Hyvae Soft 2018 /
* RallySportED-js
*
* Provides logic for dealing with the host HTML page.
*
*/
"use strict";
/// Temp hack. Set to true when a dropdown list is visible. We do this to prevent the editor from
/// receiving mouse events in the meantime, so there won't be accidental terrain edits etc. that
/// might otherwise fall through the dropdown menu.
let RSED_DROPDOWN_ACTIVATED = false;
window.onblur = function()
{
Rsed.ui.inputState.reset_keys();
return;
}
window.onunload = function()
{
Rsed.stream.stop();
return;
};
window.onbeforeunload = function(event)
{
if (!Rsed.core.current_project().areAllChangesSaved)
{
event.preventDefault();
// Note: We just need to return a string, any string - modern browsers won't display it
// regardless.
return "Leave and discard unsaved changes?";
}
}
// Parses any address bar parameters, then launches RallySportED.
window.onload = function(event)
{
// The app doesn't need to be run if we're just testing its units.
if (Rsed.unitTestRun) return;
// We'll modify RallySportED-js's default startup arguments with parameters
// the user provided via the address bar.
const rsedStartupArgs = Rsed.core.default_startup_args();
// Parse the user-supplied URL parameters.
{
const params = new URLSearchParams(window.location.search);
// If the user requests to view a stream, we just need to start the stream.
// Once the user joins the stream as a viewer, they'll receive the track's
// data and RallySportED-js will be started at that point.
if (params.has("transientServer"))
{
Rsed.stream.start("viewer", params.get("transientServer"));
return;
}
// The "track" and "content" parameters specify which track the user wants to load.
// Generally, the "track" parameter is used to load the game's original demo tracks,
// while the "content" parameter is used to load tracks (and, in the future, other
// content, like cars) from the Rally-Sport Content server.
const contentId = ((params.get("fromContent") || params.get("content")) || // <- 'fromContent' replaces 'content' since post-1.1 RallySportED-js.
params.get("track") ||
null);
// If no content identifier was provided, we'll append a default one.
if (!contentId)
{
params.append("track", "demod");
window.location.search = params.toString();
return;
}
else
{
// Give the input a sanity check.
if ((contentId.length > 20) ||
!(/^[0-9a-zA-Z-.]+$/.test(contentId)))
{
Rsed.throw("Invalid track identifier.");
return;
}
// The RallySportED-js server hosts the original Rally-Sport demo tracks.
if (["demoa", "demob", "democ", "demod", "demoe", "demof", "demog", "demoh"].includes(contentId))
{
rsedStartupArgs.project.dataLocality = "server-rsed";
}
// The Rally-Sport Content server hosts custom Rally-Sport content.
else
{
rsedStartupArgs.project.dataLocality = "server-rsc";
}
rsedStartupArgs.project.contentId = contentId;
}
if (window.location.hash == "#play")
{
history.replaceState(null, null, " "); // Remove the hash.
rsedStartupArgs.playOnStartup = true;
}
}
Rsed.core.start(rsedStartupArgs);
return;
}
window.close_dropdowns = function(resetInputState = true)
{
if (!Rsed || !Rsed.core)
{
return;
}
const dropdowns = document.getElementsByClassName("dropdown-menu");
for (let i = 0; i < dropdowns.length; i++)
{
if (dropdowns[i].classList.contains("show")) dropdowns[i].classList.toggle("show");
}
RSED_DROPDOWN_ACTIVATED = false;
if (resetInputState)
{
Rsed.ui.inputState.reset_mouse_hover();
Rsed.ui.inputState.reset_mouse_grab();
Rsed.ui.inputState.reset_mouse_buttons_state();
}
return;
}
// Right-click menu for track props.
window.oncontextmenu = function(event)
{
if (!Rsed || !Rsed.core)
{
return;
}
// If the right-click menu was already open.
if (RSED_DROPDOWN_ACTIVATED)
{
window.close_dropdowns(false);
event.preventDefault();
return;
}
// Ignore right clicks that occur over the dropdown menu.
if (event.target === document.getElementById("prop-dropdown"))
{
event.preventDefault();
return;
}
// Only handle clicks that occur over RallySportED's canvas.
if (event.target.id !== Rsed.visual.canvas.domElementID)
{
return;
}
// Only handle clicks that occur over props.
if (!Rsed.ui.inputState.current_mouse_hover() ||
Rsed.ui.inputState.current_mouse_hover().type !== "prop")
{
event.preventDefault();
return;
}
event.preventDefault();
// Display a right-click menu for changing the type of the prop under the cursor.
if ( Rsed.ui.inputState.current_mouse_hover() &&
(Rsed.ui.inputState.current_mouse_hover().type === "prop"))
{
const isFinishLine = Rsed.core.current_project().props.name(Rsed.ui.inputState.current_mouse_hover().propId).toLowerCase().startsWith("finish");
Rsed.ui.htmlUI.refresh_prop_list(isFinishLine);
const mousePos = Rsed.ui.inputState.mouse_pos();
const propDropdown = document.getElementById("prop-dropdown");
const upperMargin = -38;
propDropdown.style.left = `${mousePos.x + 25}px`;
propDropdown.style.top = `${mousePos.y + upperMargin}px`;
propDropdown.style.maxHeight = `${window.innerHeight - mousePos.y - upperMargin}px`;
propDropdown.classList.toggle("show");
RSED_DROPDOWN_ACTIVATED = true;
}
return;
}
window.onwheel = function(event)
{
if (!Rsed || !Rsed.core)
{
return;
}
// Only handle wheel events that occur over RallySportED's canvas.
if (event.target.id !== Rsed.visual.canvas.domElementID)
{
return;
}
Rsed.ui.inputState.append_wheel_scroll(Math.sign(event.deltaY) * 60);
return;
}
// The program uses onmousedown for primary click processing, but onclick is used here
// to close any open dropdown lists.
window.onclick = function(event)
{
if (!Rsed || !Rsed.core)
{
return;
}
// Only handle clicks that occur over RallySportED's canvas.
if (event.target.id !== Rsed.visual.canvas.domElementID)
{
return;
}
if (RSED_DROPDOWN_ACTIVATED)
{
window.close_dropdowns(false);
return;
}
return;
}
window.onmousedown = function(event)
{
if (!Rsed || !Rsed.core)
{
return;
}
// Only handle clicks that occur over RallySportED's canvas.
if (event.target.id !== Rsed.visual.canvas.domElementID)
{
return;
}
switch (event.button)
{
case 0: Rsed.ui.inputState.set_mouse_button_down("left", true); break;
case 1: Rsed.ui.inputState.set_mouse_button_down("middle", true); break;
case 2: Rsed.ui.inputState.set_mouse_button_down("right", true); break;
default: break;
}
return;
}
window.onmouseup = function(event)
{
if (!Rsed || !Rsed.core)
{
return;
}
// Only handle clicks that occur over RallySportED's canvas.
if (event.target.id !== Rsed.visual.canvas.domElementID)
{
return;
}
switch (event.button)
{
case 0: Rsed.ui.inputState.set_mouse_button_down("left", false); break;
case 1: Rsed.ui.inputState.set_mouse_button_down("middle", false); break;
case 2: Rsed.ui.inputState.set_mouse_button_down("right", false); break;
default: break;
}
return;
}
window.onmousemove = function(event)
{
if (!Rsed || !Rsed.core)
{
return;
}
if (event.target.id !== Rsed.visual.canvas.domElementID)
{
return;
}
if (!RSED_DROPDOWN_ACTIVATED)
{
const mouseX = (event.clientX - event.target.getBoundingClientRect().left);
const mouseY = (event.clientY - event.target.getBoundingClientRect().top);
Rsed.ui.inputState.set_mouse_pos(mouseX, mouseY);
}
return;
}
window.onkeydown = function(event)
{
if (!Rsed || !Rsed.core)
{
return;
}
// For keys used by RallySportED to which the browser also coincidentally responds,
// prevent the browser from doing so.
switch (event.key)
{
case "Tab":
case " ": event.preventDefault(); break;
default: break;
}
if (!event.repeat) Rsed.ui.inputState.set_key_down(event.key, true);
return;
}
window.onkeyup = function(event)
{
if (!Rsed || !Rsed.core)
{
return;
}
Rsed.ui.inputState.set_key_down(event.key, false);
return;
}
// Gets called when something is dropped onto RallySportED's render canvas. We expect
// the drop to be a zip file containing the files of a RallySportED project for us to
// load up. If it's not, we'll ignore the drop.
window.drop_handler = function(event)
{
if (!Rsed || !Rsed.core)
{
return;
}
// Don't let the browser handle the drop.
event.preventDefault();
// See if the drop delivers a zip file.
const zipFile = Array.from(event.dataTransfer.items, (item)=>item.getAsFile())
.filter(file=>(file != null))
.filter(file=>(file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase() === "zip"))
[0] || null;
if (!zipFile)
{
Rsed.log("The drop contained no RallySportED zip files. Ignoring it.");
return;
}
// Launch RallySportED-js with the dropped-in project's data.
Rsed.core.start({
project: {
dataLocality: "client",
contentId: zipFile,
},
});
if ((Rsed.stream.role !== "server") && /// TODO: Instead of checking these roles individually, we could have a flag
(Rsed.stream.role !== "streamer")) /// in Rsed.stream that indicates whether this stream is a receiver or sender.
{
// Clear the address bar's parameters to reflect the fact that the user has loaded a local
// track resource instead of specifying a server-side resource via the address bar.
const basePath = (window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1));
window.history.replaceState({}, document.title, basePath);
}
return;
}
/*
* Most recent known filename: js/ui/input-state.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
// Stores and provides information about the current state of user input (keyboard and
// mouse interaction).
Rsed.ui.inputState = (function()
{
// For each key code, a boolean to indicate whether that key is current down. Note
// that the key codes are stored as uppercase characters, so e.g. 69 is stored as "E".
const keyboardState = {};
const mouseState =
{
// Which of the mouse buttons are currently down, and which modifiers were
// being pressed when the click was registered.
buttons:
{
left:
{
isDown: false,
modifiers: [],
},
middle:
{
isDown: false,
modifiers: [],
},
right:
{
isDown: false,
modifiers: [],
},
},
// Wheel scroll.
wheel: 0,
// Where inside the RallySportED canvas the mouse cursor is currently located.
position:
{
x: 0,
y: 0,
},
// Which mouse-picking buffer element the cursor is currently hovering over.
hover: null,
// Which mouse-picking buffer element the cursor most recently clicked on.
// When the button is clicked, the grab is put into effect; and when the
// button is released, the grab is released also.
grab: null,
};
// For touch screen controls.
const touchState =
{
isTouching: false,
// Where, in screen coordinates, the current touch started.
touchStart:
{
x: 0,
y: 0,
},
// Where, in screen coordinates, the current touch is located now.
currentTouchPos:
{
x: 0,
y: 0,
},
};
const publicInterface =
{
// For touch screen controls.
set_is_touching: function(isTouching = false, {startX = 0, startY = 0})
{
touchState.isTouching = Boolean(isTouching);
if (touchState.isTouching)
{
touchState.touchStart.x = startX;
touchState.touchStart.y = startY;
this.update_touch_position({x:touchState.touchStart.x, y: touchState.touchStart.y});
}
else
{
touchState.touchStart.x = touchState.currentTouchPos.x = 0;
touchState.touchStart.y = touchState.currentTouchPos.y = 0;
}
},
// For touch screen controls.
update_touch_position({x = 0, y = 0})
{
touchState.currentTouchPos.x = x;
touchState.currentTouchPos.y = y;
},
// For touch screen controls. Returns the amount by which the current
// touch has moved since the last time this function was called. Note
// that calling this function will reset the count, so you'd only want
// to call this e.g. once per frame.
get_touch_move_delta: function()
{
if (!touchState.isTouching)
{
return {x: 0, y: 0};
}
const delta =
{
x: ((touchState.currentTouchPos.x - touchState.touchStart.x) / 5),
y: ((touchState.currentTouchPos.y - touchState.touchStart.y) / 5),
};
touchState.touchStart.x = touchState.currentTouchPos.x;
touchState.touchStart.y = touchState.currentTouchPos.y;
return delta;
},
mouse_pos: function()
{
return {...mouseState.position};
},
mouse_pos_scaled_to_render_resolution: function()
{
// Note: We guard against Rsed.visual.canvas being undefined, which
// it may be when running unit tests.
const scaledX = Math.floor(mouseState.position.x * (Rsed.visual.canvas? Rsed.visual.canvas.scalingFactor : 1));
const scaledY = Math.floor(mouseState.position.y * (Rsed.visual.canvas? Rsed.visual.canvas.scalingFactor : 1));
const clampedX = Math.max(0, Math.min(((Rsed.visual.canvas? Rsed.visual.canvas.width : 1) - 1), scaledX));
const clampedY = Math.max(0, Math.min(((Rsed.visual.canvas? Rsed.visual.canvas.height : 1) - 1), scaledY));
return {...mouseState.position, x:clampedX, y:clampedY};
},
mouse_button_down: function()
{
return (this.left_mouse_button_down() |
this.mid_mouse_button_down() |
this.right_mouse_button_down());
},
left_mouse_button_down: function()
{
return mouseState.buttons.left.isDown;
},
left_mouse_click_modifiers: function()
{
return mouseState.buttons.left.modifiers;
},
mid_mouse_button_down: function()
{
return mouseState.buttons.middle.isDown;
},
mid_mouse_click_modifiers: function()
{
return mouseState.buttons.middle.modifiers;
},
right_mouse_button_down: function()
{
return mouseState.buttons.right.isDown;
},
right_mouse_click_modifiers: function()
{
return mouseState.buttons.right.modifiers;
},
left_or_right_mouse_button_down: function()
{
return (mouseState.buttons.left || mouseState.buttons.right);
},
key_down: function(key)
{
Rsed.throw_if_not_type("string", key);
return Boolean(keyboardState[key.toUpperCase()] &&
keyboardState[key.toUpperCase()].isDown);
},
current_mouse_hover: function()
{
return mouseState.hover;
},
current_mouse_grab: function()
{
return mouseState.grab;
},
// Force the current mouse hover information to update.
update_mouse_hover: function()
{
this.set_mouse_pos(this.mouse_pos().x, this.mouse_pos().y);
},
reset_mouse_hover: function()
{
mouseState.hover = null;
},
reset_mouse_grab: function()
{
mouseState.grab = null;
},
reset_mouse_buttons_state: function()
{
mouseState.buttons.left = {isDown: false, modifiers: []};
mouseState.buttons.mid = {isDown: false, modifiers: []};
mouseState.buttons.right = {isDown: false, modifiers: []};
},
reset_modifier_keys_state: function()
{
this.set_key_down("shift", false);
this.set_key_down("control", false);
this.set_key_down("tab", false);
this.set_key_down("alt", false);
this.set_key_down("altgraph", false);
},
reset_keys: function()
{
for (const keyIdx of Object.keys(keyboardState))
{
clearTimeout(keyboardState[keyIdx].cooldown);
clearInterval(keyboardState[keyIdx].repeat);
keyboardState[keyIdx].isDown = false;
}
},
reset_wheel_scroll: function()
{
mouseState.wheel = 0;
},
mouse_wheel_scroll: function()
{
return mouseState.wheel;
},
append_wheel_scroll: function(delta)
{
Rsed.throw_if_not_type("number", delta);
// Note: For now, we require that the Shift key be pressed down for mouse
// scroll to be registered. This is done so that the scroll wheel can be
// used normally to scroll the contents of the viewport when the Shift is
// not pressed, and when it is, the viewport is assumed to not scroll and
// so we can instead act on the scroll in RallySportED.
if (this.key_down("shift"))
{
mouseState.wheel += delta;
}
},
// Mark the current key as being or not being down. Note that when a key is
// marked as being down, it'll keep firing (auto-repeating) until it's marked
// as being not down.
set_key_down: function(keyCode, isDown = false)
{
Rsed.throw_if_not_type("boolean", isDown);
if (Rsed.player.is_playing())
{
return;
}
const keyIdx = (()=>
{
switch (typeof keyCode)
{
case "string": return keyCode.toUpperCase();
case "number": return String.fromCharCode(keyCode).toUpperCase();
default: Rsed.throw("Unknown variable type for key code."); return "unknown";
}
})();
keyboardState[keyIdx] = (keyboardState[keyIdx] || {});
keyboardState[keyIdx].isDown = isDown;
clearTimeout(keyboardState[keyIdx].cooldown);
clearInterval(keyboardState[keyIdx].repeat);
keyboardState[keyIdx].cooldown = null;
keyboardState[keyIdx].repeat = null;
if (isDown)
{
keyboardState[keyIdx].cooldown = setTimeout(()=>
{
keyboardState[keyIdx].repeat = setInterval(fire_key, 75);
}, 250);
}
fire_key(false);
function fire_key(isRepeat = true)
{
if (Rsed.core.current_scene())
{
Rsed.core.current_scene()[(isDown? "on_key_fire" : "on_key_release")](keyIdx, isRepeat);
}
}
},
set_mouse_pos: function(x = 0, y = 0)
{
Rsed.throw_if_not_type("number", x, y);
if (Rsed.player.is_playing())
{
return;
}
mouseState.position.x = x;
mouseState.position.y = y;
// Update the hover info.
// Note: We guard against Rsed.visual.canvas being undefined, which
// it may be when running unit tests.
const mousePos = this.mouse_pos_scaled_to_render_resolution();
mouseState.hover = (Rsed.visual.canvas
? Rsed.visual.canvas.mousePickingBuffer[mousePos.x + mousePos.y * Rsed.visual.canvas.width]
: null);
},
set_mouse_button_down: function(button = "left", isDown = false)
{
Rsed.throw_if_undefined(mouseState.buttons[button]);
Rsed.throw_if_not_type("string", button);
Rsed.throw_if_not_type("boolean", isDown);
if (Rsed.player.is_playing())
{
return;
}
if (isDown)
{
mouseState.buttons[button].isDown = true;
mouseState.buttons[button].modifiers = (()=>
{
knownModifiers = ["shift", "control", "alt", "tab"];
return knownModifiers.filter(modifier=>this.key_down(modifier));
})();
}
else
{
mouseState.buttons[button].isDown = false;
mouseState.buttons[button].modifiers.length = 0;
}
if (!this.mouse_button_down())
{
mouseState.grab = null;
}
else if (!mouseState.grab)
{
mouseState.grab = mouseState.hover;
}
},
};
return publicInterface;
})();
/*
* Most recent known filename: js/ui/mouse-picking.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
// Returns an object that can be assigned to an element in the mouse-picking buffer.
//
// The 'type' parameter determines the type of mouse-picking; while the 'args' object
// will be appended as-is to the object returned - it will thus contain the custom
// values that you want to include in this element of the mouse-picking buffer.
//
// The returned object takes the following form:
//
//   {
//       type,
//       ...args,
//   }
//
// Although you could simply create this object in-place rather than by calling this
// function, the function will additionally perform checks on the validity of the
// object prior to returning it - like whether it contains at least the required
// arguments.
//
Rsed.ui.mouse_picking_element = function(type = "", args = {})
{
Rsed.throw_if_not_type("string", type);
Rsed.throw_if_not_type("object", args);
// Verify that the arguments are correct.
switch (type)
{
// An element displayed on the user interface (e.g. the track minimap).
//
// Requires the following properties:
//
//   uiElementId: A string identifying this UI element.
//
case "ui-element":
{
Rsed.throw_if_not_type("string", args.uiElementId);
break;
}
// A track-side 3d object.
//
// Requires the following properties:
//
//   propId: A value identifying the prop's type (e.g. tree, rock, house).
//   propTrackIdx: The prop's index among all props on the track.
//
case "prop":
{
Rsed.throw_if_not_type("number", args.propTrackIdx, args.propId);
break;
}
// A ground tile on the 3d track heightmap.
//
// Requires the following properties:
//
//   groundTileX: Ground tile index on the X axis (so e.g. 127 is the last tile on a 128-tile-wide track).
//   groundTileY: Ground tile index on the Y axis.
//
case "ground":
{
Rsed.throw_if_not_type("number", args.groundTileX, args.groundTileY);
break;
}
default: Rsed.throw("Unrecognized mouse-picking type."); break;
}
return {type, ...args};
}
/*
* Most recent known filename: js/ui/component.js
*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// A base implementation of a UI component.
//
// To create a new component, call this function to receive a component base,
// then modify its draw() and update() functions according to your wishes.
Rsed.ui.component = function()
{
const publicInterface =
{
// A string that uniquely identifies this component from other components.
id: Object.freeze(Rsed.generate_uuid4_string()),
// If the mouse cursor is currently grabbing this component, returns the grab
// information; otherwise null is returned.
is_grabbed: function()
{
const grab = Rsed.ui.inputState.current_mouse_grab();
if (grab && (grab.componentId == this.id))
{
return grab;
}
else
{
return null;
}
},
// If the mouse cursor is currently hovering over this component, returns the
// hover information; otherwise null is returned.
is_hovered: function()
{
const hover = Rsed.ui.inputState.current_mouse_hover();
if (hover && (hover.componentId == this.id))
{
return hover;
}
else
{
return null;
}
},
// Updates the component's internal state (e.g. to respond to user input).
update: function(sceneSettings = {})
{
return;
},
// Renders the component to the currently-active canvas and at the given
// XY canvas coordinates.
draw: function(offsetX = 0, offsetY = 0)
{
return;
},
};
return publicInterface;
}
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// A UI component that displays the currently-selected PALA texture. Clicking
// on the component opens/closes the scene's PALAT pane.
Rsed.ui.component.activePala =
{
// Creates and returns a new instance of the component.
instance: function()
{
const component = Rsed.ui.component();
component.update = function(sceneSettings = {})
{
Rsed.throw_if_not_type("object", sceneSettings);
Rsed.throw_if_undefined(sceneSettings.showPalatPane);
if (component.is_grabbed())
{
sceneSettings.showPalatPane = !sceneSettings.showPalatPane;
Rsed.ui.inputState.reset_mouse_grab();
}
};
component.draw = function(offsetX = 0, offsetY = 0)
{
Rsed.throw_if_not_type("number", offsetX, offsetY);
const currentPalaIdx = Rsed.ui.groundBrush.brush_pala_idx();
const billboardIdx = Rsed.core.current_project().palat.billboard_idx(currentPalaIdx);
const palaTexture = Rsed.core.current_project().palat.texture[currentPalaIdx];
const billboardTexture = (billboardIdx == null)
? null
: Rsed.core.current_project().palat.texture[billboardIdx];
const mousePick = new Array(palaTexture.indices.length).fill({
type: "ui-component",
componentId: component.id,
});
if (palaTexture)
{
Rsed.ui.draw.image(palaTexture.indices, mousePick, 16, 16, offsetX, offsetY, false, true);
if (billboardTexture)
{
Rsed.ui.draw.image(billboardTexture.indices, null, 16, 16, offsetX, offsetY, true, true);
}
Rsed.ui.draw.string((Rsed.ui.groundBrush.brush_size() + 1) + "*", (offsetX - 7), (offsetY - 1))
}
else
{
Rsed.throw("Invalid brush PALA index.");
}
};
return component;
}
}
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// A UI component that displays the current renderer frame rate (FPS).
Rsed.ui.component.fpsIndicator =
{
instance: function()
{
const component = Rsed.ui.component();
component.draw = function(offsetX = 0, offsetY = 0)
{
Rsed.throw_if_not_type("number", offsetX, offsetY);
Rsed.ui.draw.string(`FPS: ${Rsed.core.renderer_fps()}`, offsetX, offsetY);
};
return component;
}
}
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
* A UI component that displays information about the ground under the
* mouse cursor. This information might be, for instance, the height of
* the terrain or the name of a prop.
*
*/
"use strict";
Rsed.ui.component.groundHoverInfo =
{
instance: function()
{
const component = Rsed.ui.component();
component.draw = function(offsetX = 0, offsetY = 0)
{
Rsed.throw_if_not_type("number", offsetX, offsetY);
const mouseHover = Rsed.ui.inputState.current_mouse_hover();
const mouseGrab = Rsed.ui.inputState.current_mouse_grab();
let str = "HEIGHT:+000   PALA:000   X,Y:000,000";
if ((mouseHover && (mouseHover.type === "prop")) ||
(mouseGrab && (mouseGrab.type === "prop")))
{
// Prefer mouseGrab over mouseHover, as the prop follows the cursor lazily while
// grabbing, so hover might be over the background.
const mouse = (mouseGrab && (mouseGrab.type === "prop"))
? mouseGrab
: mouseHover;
str = `PROP: "${Rsed.core.current_project().props.name(mouse.propId)}"`;
}
else if (mouseHover && (mouseHover.type === "ground"))
{
const x = mouseHover.groundTileX;
const y = mouseHover.groundTileY;
const xStr = String(x).padStart(3, "0");
const yStr = String(y).padStart(3, "0");
const heightStr = (Rsed.core.current_project().maasto.tile_at(x, y) < 0? "-" : "+") +
String(Math.abs(Rsed.core.current_project().maasto.tile_at(x, y))).padStart(3, "0");
const palaStr = String(Rsed.core.current_project().varimaa.tile_at(x, y)).padStart(3, "0");
str = `HEIGHT:${heightStr}   PALA:${palaStr}   X,Y:${xStr},${yStr}`;
}
Rsed.ui.draw.string(str, offsetX, offsetY);
};
return component;
}
}
/*
* 2018-2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// A UI component that displays a thumbnail of each of the current project's PALA textures.
// The user can click on the thumbnails to select which texture to paint the ground with.
Rsed.ui.component.palatPane =
{
instance: function(options = {})
{
options = {
// Default options.
...{
// Whether to draw an indicator around the currently-selected PALA.
indicateSelection: true,
// Whether to draw an indicator around the PALA over which the mouse currently hovers.
indicateHover: true,
// Whether to always indicate which PALA index the cursor is hovering
// over.
alwaysShowIdxTag: false,
// A function called when the user selects a PALA.
selectionCallback: (palaIdx)=>{},
},
...options,
};
const component = Rsed.ui.component();
// We'll pre-generate the thumbnails into these pixel buffers.
const palatPaneBuffer = [];
const palatPaneMousePick = [];
let numPalatPaneCols = 9;
let numPalatPaneRows = 29;
let palatPaneWidth = 0;
let palatPaneHeight = 0;
let palatPaneOffsetX = undefined;
let palatPaneOffsetY = undefined;
component.update = function()
{
const grab = component.is_grabbed();
if (grab)
{
if (Rsed.ui.inputState.left_mouse_button_down() ||
Rsed.ui.inputState.right_mouse_button_down())
{
Rsed.ui.groundBrush.set_brush_pala_idx(grab.palaIdx);
options.selectionCallback(grab.palaIdx);
}
}
};
component.draw = function(offsetX = 0, offsetY = 0)
{
generate_palat_pane();
offsetX -= palatPaneWidth;
palatPaneOffsetX = offsetX;
palatPaneOffsetY = offsetY;
if (palatPaneBuffer.length > 0)
{
Rsed.ui.draw.image(palatPaneBuffer, palatPaneMousePick,
palatPaneWidth, palatPaneHeight,
palatPaneOffsetX, palatPaneOffsetY);
// Draw indicators for mouse hover/selection/etc.
{
const frameWidth = 9;
const frameHeight = 9;
const X = "yellow";
const _ = 0;
// Draw a frame around the currently-selected PALA.
if (options.indicateSelection)
{
const frame = [
X,X,X,X,X,X,X,X,X,
X,_,_,_,_,_,_,_,X,
X,_,_,_,_,_,_,_,X,
X,_,_,_,_,_,_,_,X,
X,_,_,_,_,_,_,_,X,
X,_,_,_,_,_,_,_,X,
X,_,_,_,_,_,_,_,X,
X,_,_,_,_,_,_,_,X,
X,X,X,X,X,X,X,X,X,
];
const selectedPalaIdx = Rsed.ui.groundBrush.brush_pala_idx();
const y = Math.floor(selectedPalaIdx / numPalatPaneCols);
const x = (selectedPalaIdx - y * numPalatPaneCols);
Rsed.ui.draw.image(frame, null,
frameWidth, frameHeight,
palatPaneOffsetX + x * 8, palatPaneOffsetY + y * 8,
true);
}
const mouseHover = component.is_hovered()
// Draw a frame around the PALA over which the mouse cursor is hovering.
if (mouseHover && options.indicateHover)
{
const frame = [
X,X,X,_,_,_,X,X,X,
X,_,_,_,_,_,_,_,X,
X,_,_,_,_,_,_,_,X,
_,_,_,_,_,_,_,_,_,
_,_,_,_,X,_,_,_,_,
_,_,_,_,_,_,_,_,_,
X,_,_,_,_,_,_,_,X,
X,_,_,_,_,_,_,_,X,
X,X,X,_,_,_,X,X,X,
];
Rsed.ui.draw.image(frame, null,
frameWidth, frameHeight,
mouseHover.cornerX, mouseHover.cornerY,
true);
}
// Draw a label on the PALA over which the mouse cursor hovers in the
// PALAT pane.
if (mouseHover &&
(options.alwaysShowIdxTag ||
Rsed.ui.inputState.key_down("tab")))
{
const label = `${mouseHover.palaIdx}`;
const labelPixelWidth = Rsed.ui.font.width_in_pixels(label);
const labelPixelHeight = Rsed.ui.font.nativeHeight;
const x = (mouseHover.cornerX - labelPixelWidth);
const y = (mouseHover.cornerY - labelPixelHeight);
Rsed.ui.draw.string(label, x, y);
}
}
}
return;
};
// Create a set of thumbnails of the contents of the current PALAT file. We'll
// display this pane of thumbnails to the user for selecting PALAs.
function generate_palat_pane()
{
if ((Rsed.visual.canvas.height <= 0) ||
(Rsed.visual.canvas.width <= 0))
{
return;
}
const maxNumPalas = 253;
const palaWidth = Rsed.constants.palaWidth;
const palaHeight = Rsed.constants.palaHeight;
const palaThumbnailWidth = (palaWidth / 2);
const palaThumbnailHeight = (palaHeight / 2);
palatPaneBuffer.length = 0;
palatPaneMousePick.length = 0;
palatPaneHeight = ((Math.round((Rsed.visual.canvas.height - palatPaneOffsetY) / palaThumbnailHeight) - 1) * palaThumbnailHeight);
numPalatPaneRows = Math.ceil(palatPaneHeight / (palaHeight / 2));
numPalatPaneCols = Math.ceil(maxNumPalas / numPalatPaneRows);
palatPaneWidth = (numPalatPaneCols * (palaWidth / 2));
// Make room for the border.
palatPaneWidth++;
palatPaneHeight++;
if ((numPalatPaneCols <= 0) ||
(numPalatPaneRows <= 0))
{
return;
}
let palaIdx = 0;
for (let y = 0; y < numPalatPaneRows; y++)
{
for (let x = 0; x < numPalatPaneCols; (x++, palaIdx++))
{
if (palaIdx > maxNumPalas) break;
const pala = Rsed.core.current_project().palat.texture[palaIdx];
for (let py = 0; py < palaHeight; py++)
{
for (let px = 0; px < palaWidth; px++)
{
const palaTexel = Math.floor(px + (palaHeight - py - 1) * palaWidth);
const bufferTexel = Math.floor((Math.floor(x * palaWidth + px) / 2) +
Math.floor((y * palaHeight + py) / 2) * palatPaneWidth);
palatPaneBuffer[bufferTexel] = Rsed.visual.palette.color_at_idx(pala.indices[palaTexel]);
palatPaneMousePick[bufferTexel] = {
type: "ui-component",
componentId: component.id,
palaIdx: palaIdx,
cornerX: ((x * palaThumbnailWidth) + palatPaneOffsetX),
cornerY: ((y * palaThumbnailHeight) + palatPaneOffsetY),
};
}
}
}
}
// Draw a grid over the PALA thumbnails.
for (let i = 0; i < numPalatPaneRows * palaHeight/2; i++)
{
for (let x = 0; x < numPalatPaneCols; x++)
{
palatPaneBuffer[(x * palaWidth/2) + i * palatPaneWidth] = "black";
}
}
for (let i = 0; i < numPalatPaneCols * palaWidth/2; i++)
{
for (let y = 0; y < numPalatPaneRows; y++)
{
palatPaneBuffer[i + (y * palaHeight/2) * palatPaneWidth] = "black";
}
}
return;
};
return component;
}
}
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// A UI component that displays a thumbnail of current project's tilemap. Clicking
// on the thumbnail centers the camera on that position.
Rsed.ui.component.tilemapMinimap =
{
instance: function()
{
const component = Rsed.ui.component();
component.update = function()
{
const grab = component.is_grabbed();
if (grab)
{
const x = Math.round((grab.tileX - (Rsed.world.camera.view_width / 2)) + 1);
const z = Math.round((grab.tileZ - (Rsed.world.camera.view_height / 2)) + 1);
const y = Rsed.world.camera.position().y;
Rsed.world.camera.set_camera_position(x, y, z)
}
};
component.draw = function(offsetX = 0, offsetY = 0)
{
Rsed.throw_if_not_type("number", offsetX, offsetY);
// Generate the minimap image by iterating over the tilemap and grabbing a pixel off each
// corresponding PALA texture.
/// TODO: You can pre-generate the image rather than re-generating it each frame.
const width = 64;
const height = 32;
const xMul = (Rsed.core.current_project().maasto.width / width);
const yMul = (Rsed.core.current_project().maasto.width / height);
const image = []; // An array of palette indices that forms the minimap image.
const mousePick = [];
for (let y = 0; y < height; y++)
{
for (let x = 0; x < width; x++)
{
const tileX = (x * xMul);
const tileZ = (y * yMul);
const pala = Rsed.core.current_project().palat.texture[Rsed.core.current_project().varimaa.tile_at(tileX, tileZ)];
let color = ((pala == null)? 0 : pala.indices[1]);
image.push(color);
mousePick.push({
type: "ui-component",
componentId: component.id,
tileX: tileX,
tileZ: tileZ
});
}
}
Rsed.ui.draw.image(image, mousePick, width, height, (offsetX - width), offsetY, false);
// Draw a frame around the camera view on the minimap.
if (image && xMul && yMul)
{
const frame = [];
const frameWidth = Math.round((Rsed.world.camera.view_width / xMul));
const frameHeight = Math.round((Rsed.world.camera.view_height / yMul));
for (let y = 0; y < frameHeight; y++)
{
for (let x = 0; x < frameWidth; x++)
{
let color = 0;
if (y % (frameHeight - 1) === 0) color = "yellow";
if (x % (frameWidth - 1) === 0) color = "yellow";
frame.push(color);
}
}
const cameraPos = Rsed.world.camera.position_floored();
const maxX = (Rsed.core.current_project().maasto.width - Rsed.world.camera.view_width);
const maxZ = (Rsed.core.current_project().maasto.height - Rsed.world.camera.view_height);
const camX = Math.max(0, (Math.min(maxX, cameraPos.x) / xMul));
const camZ = Math.max(0, (Math.min(maxZ, cameraPos.z) / yMul));
Rsed.ui.draw.image(frame, null, frameWidth, frameHeight, (offsetX - width + camX), (offsetY + camZ), true);
}
return;
}
return component;
}
}
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// A UI component that displays a list of clickable color swatches that represents the
// current project's color palette, allowing the user to indicate which color he wants
// (e.g. to paint a texture with).
Rsed.ui.component.colorSelector =
{
instance: function(options = {})
{
options = {
// Default options.
...{
// A function called when the user selects a color.
selectionCallback: (colorIdx)=>{},
},
...options,
};
const component = Rsed.ui.component();
// A swatch of a particular color, clickable by the user to select that color.
const swatchSideLen = 8;
const swatch = new Array(swatchSideLen * swatchSideLen);
const swatchMousePick = new Array(swatch.length);
// A swatch indicating the currently-selecter color.
const curColorSwatchWidth = 33;
const curColorSwatchHeight = 32;
const curColorSwatch = new Array(curColorSwatchWidth * curColorSwatchHeight);
// The currently-selected color - an index to the current Rsed.visual.palette
// palette.
let currentColorIdx = 19;
component.set_color_idx = function(newIdx = 0)
{
Rsed.throw_if_not_type("number", newIdx);
currentColorIdx = newIdx;
}
component.update = function(sceneSettings = {})
{
Rsed.throw_if_not_type("object", sceneSettings);
Rsed.throw_if_undefined(sceneSettings.penColorIdx);
sceneSettings.penColorIdx = currentColorIdx;
if (component.is_grabbed())
{
const penColorIdx = Rsed.ui.inputState.current_mouse_grab().colorIdx;
currentColorIdx = penColorIdx;
options.selectionCallback(penColorIdx);
Rsed.ui.inputState.reset_mouse_grab();
}
};
component.draw = function(offsetX = 0, offsetY = 0)
{
Rsed.throw_if_not_type("number", offsetX, offsetY);
const numSwatchesPerRow = 8;
// Draw a grid of color swatches.
for (let i = 0; i < Rsed.visual.palette.numColorsInPalette; i++)
{
const y = Math.floor(i / numSwatchesPerRow);
const x = (i % numSwatchesPerRow);
swatch.fill(Rsed.visual.palette.color_at_idx(i));
swatchMousePick.fill({
type: "ui-component",
componentId: component.id,
colorIdx: i,
});
Rsed.ui.draw.image(swatch, swatchMousePick,
swatchSideLen, swatchSideLen,
(offsetX + (x * swatchSideLen)),
(offsetY + (y * swatchSideLen)));
}
// Draw a frame around the currently-selected swatch.
{
const frame = [];
const frameWidth = (swatchSideLen + 2);
const frameHeight = (swatchSideLen + 2);
for (let y = 0; y < frameHeight; y++)
{
for (let x = 0; x < frameWidth; x++)
{
let color = 0;
if (y % (frameHeight - 1) === 0) color = (currentColorIdx || "black");
if (x % (frameWidth - 1) === 0) color = (currentColorIdx || "black");
frame.push(color);
}
}
const y = Math.floor(currentColorIdx / numSwatchesPerRow);
const x = (currentColorIdx - y * numSwatchesPerRow);
Rsed.ui.draw.image(frame, null,
frameWidth, frameHeight,
(offsetX + (x * swatchSideLen) - 1),
(offsetY + (y * swatchSideLen) - 1),
true);
}
// Draw a large swatch of the currently-selected color.
{
const swatchX = (offsetX + (numSwatchesPerRow * swatchSideLen));
const swatchY = offsetY;
const colorIdxLabel = `${currentColorIdx}`;
curColorSwatch.fill(Rsed.visual.palette.color_at_idx(currentColorIdx));
Rsed.ui.draw.image(curColorSwatch, null,
curColorSwatchWidth, curColorSwatchHeight,
swatchX,
swatchY);
Rsed.ui.draw.string(colorIdxLabel,
(swatchX + (curColorSwatchWidth / 2) - (Rsed.ui.font.width_in_pixels(colorIdxLabel) / 2) - 1),
(swatchY + (curColorSwatchHeight / 2) - (Rsed.ui.font.nativeHeight / 2)));
}
};
return component;
}
}
/*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
* A UI component that displays a string.
*
*/
"use strict";
Rsed.ui.component.label =
{
instance: function()
{
const component = Rsed.ui.component();
let labelString = "Hello";
component.draw = function(screenX = 0, screenY = 0)
{
Rsed.throw_if_not_type("number", screenX, screenY);
Rsed.ui.draw.string(labelString, screenX, screenY);
};
component.update = function(string)
{
Rsed.throw_if_not_type("string", string);
labelString = string;
}
return component;
}
}
/*
* Most recent known filename: js/scene/scene.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
// A scene consists of a UI, a 3d mesh, and an input handler for one view to the current
// project. For instance, you might have a 3d scene, which shows the project's track as a
// textured 3d mesh; and a tilemap scene, which displays the project's tilemap for the
// user to edit.
Rsed.scene = function(args = {})
{
Rsed.throw_if_not_type("object", args);
args =
{
...{
draw_mesh: ()=>{},
draw_ui: ()=>{},
handle_user_interaction: ()=>{},
on_key_fire: ()=>{},
on_key_release: ()=>{},
},
...args
};
const publicInterface =
{
...args,
};
return publicInterface;
}
/*
* Most recent known filename: js/scenes/scene-3d.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
Rsed.scenes = Rsed.scenes || {};
// RallySportED's main scene. Displays the project as a textured 3d mesh; and allows
// the user to edit the heightmap and tilemap via mouse and keyboard interaction.
Rsed.scenes["3d"] = (function()
{
// Lets us keep track of mouse position delta between frames; e.g. for dragging props.
let prevMousePos = {x:0, y:0};
/// Temp hack. Lets the renderer know that we want it to update mouse hover information
/// once the next frame has finished rendering. This is used e.g. to keep proper track
/// mouse hover when various UI elements are toggled on/off.
let updateMouseHoverOnFrameFinish = false;
const sceneSettings = {
// Whether to draw a wireframe around the scene's polygons. Note that we default to
// not showing the wireframe on mobile devices, since we assume that they have small
// screens and so not enough resolution to show the wireframe as anything but a
// pixely mess.
showWireframe: false,
// Whether to show the PALAT pane; i.e. a side panel that displays all the available
// PALA textures.
showPalatPane: false,
// Whether to render props (track-side 3d objects - like trees, billboards, etc.).
showProps: true,
// Whether the currently-selected brush PALA texture should be painted over the
// ground tile over which the mouse cursor is currently hovering. This gives the
// user a preview of what that texture would look like, without modifying the
// tile's actual texture.
showHoverPala: false,
}
// In which direction(s) the camera is currently moving. This is affected
// by e.g. user input.
const cameraMovement = {
up: false,
down: false,
left: false,
right: false,
msSinceLastUpdate: 0,
isMobileControls: false,
};
// Load UI components.
let uiComponents = null;
(async()=>
{
uiComponents = {
activePala:   Rsed.ui.component.activePala.instance(),
footerInfo:   Rsed.ui.component.groundHoverInfo.instance(),
minimap:      Rsed.ui.component.tilemapMinimap.instance(),
palatPane:    Rsed.ui.component.palatPane.instance(),
fpsIndicator: Rsed.ui.component.fpsIndicator.instance(),
};
})();
return Rsed.scene(
{
on_key_release: function(key)
{
function key_is(compared)
{
return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
}
if (key_is("s"))
{
cameraMovement.up = false;
}
else if (key_is("f"))
{
cameraMovement.down = false;
}
else if (key_is("e"))
{
cameraMovement.left = false;
}
else if (key_is("d"))
{
cameraMovement.right = false;
}
return;
},
on_key_fire: function(key, repeat = false)
{
function key_is(compared)
{
return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
}
if (key_is("s"))
{
cameraMovement.up = true;
}
else if (key_is("f"))
{
cameraMovement.down = true;
}
else if (key_is("e"))
{
cameraMovement.left = true;
}
else if (key_is("d"))
{
cameraMovement.right = true;
}
else if (key_is("a") && !repeat)
{
sceneSettings.showPalatPane = !sceneSettings.showPalatPane;
// Prevent a mouse click from acting on the ground behind the pane when the pane
// is brought up, and on the pane when the pane has been removed.
updateMouseHoverOnFrameFinish = true;
}
else if (key_is("z"))
{
if (Rsed.ui.inputState.key_down("control") &&
Rsed.ui.inputState.key_down("shift"))
{
Rsed.ui.undoStack.redo();
}
else if (Rsed.ui.inputState.key_down("control"))
{
Rsed.ui.undoStack.undo();
}
}
else if (key_is("y") &&
Rsed.ui.inputState.key_down("control") )
{
Rsed.ui.undoStack.redo();
}
else if (key_is("q"))
{
Rsed.core.set_scene("tilemap");
}
else if (key_is("t"))
{
const mouseHover = Rsed.ui.inputState.current_mouse_hover();
if (mouseHover && mouseHover.texture)
{
Rsed.scenes["texture"].set_texture(mouseHover.texture);
}
Rsed.core.set_scene("texture");
}
else if (key_is("arrowup") ||
key_is("arrowdown"))
{
const mouseHover = Rsed.ui.inputState.current_mouse_hover();
if (mouseHover && (mouseHover.type == "ground"))
{
const delta = (key_is("arrowup")? 1 : -1);
Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changeHeight,
delta,
mouseHover.groundTileX,
mouseHover.groundTileY);
}
}
else if (key_is("w") && !repeat)
{
sceneSettings.showWireframe = !sceneSettings.showWireframe;
}
else if (key_is("g") && !repeat)
{
sceneSettings.showHoverPala = !sceneSettings.showHoverPala;
}
else if (key_is("l") && !repeat)
{
const newHeight = parseInt(window.prompt("Level the terrain to a height of..."), 10);
if (!isNaN(newHeight))
{
for (let y = 0; y < Rsed.core.current_project().maasto.height; y++)
{
for (let x = 0; x < Rsed.core.current_project().maasto.width; x++)
{
Rsed.ui.assetMutator.user_edit("maasto", {
command: "set-height",
target: {x, y},
data: newHeight,
});
}
}
}
}
else if (key_is("b") && !repeat)
{
sceneSettings.showProps = !sceneSettings.showProps;
}
else if (key_is(" ") && !repeat)
{
Rsed.ui.groundBrush.brushSmoothens = !Rsed.ui.groundBrush.brushSmoothens;
}
else
{
for (const brushSizeKey of ["1", "2", "3", "4", "5"])
{
if (key_is(brushSizeKey))
{
Rsed.ui.groundBrush.set_brush_size((brushSizeKey == 5)? 8 : (brushSizeKey - 1));
}
}
}
return;
},
draw_ui: function()
{
if ((Rsed.visual.canvas.width <= 0) ||
(Rsed.visual.canvas.height <= 0))
{
return;
}
Rsed.ui.draw.begin_drawing(Rsed.visual.canvas);
if (uiComponents) // Once the UI components have finished async loading.
{
if (Rsed.visual.canvas.domElement.clientWidth > 650)
{
if (!Rsed.browserMetadata.isMobile)
{
uiComponents.activePala.update(sceneSettings);
uiComponents.activePala.draw((Rsed.visual.canvas.width - 88), 11);
uiComponents.footerInfo.update(sceneSettings);
uiComponents.footerInfo.draw(0, (Rsed.visual.canvas.height - Rsed.ui.font.nativeHeight - 2));
}
uiComponents.minimap.update(sceneSettings);
uiComponents.minimap.draw((Rsed.visual.canvas.width - 4), 11);
if (sceneSettings.showPalatPane)
{
uiComponents.palatPane.update(sceneSettings);
uiComponents.palatPane.draw((Rsed.visual.canvas.width - 4), 47);
}
}
if (Rsed.core.fps_counter_enabled())
{
uiComponents.fpsIndicator.update(sceneSettings);
uiComponents.fpsIndicator.draw(3, 10);
}
}
Rsed.ui.draw.finish_drawing(Rsed.visual.canvas);
// Note: We assume that UI drawing is the last step in rendering the current
// frame; and thus that once the UI rendering has finished, the frame is finished
// also.
if (updateMouseHoverOnFrameFinish)
{
Rsed.ui.inputState.update_mouse_hover();
updateMouseHoverOnFrameFinish = false;
}
return;
},
draw_mesh: function()
{
move_camera();
const trackMesh = Rsed.world.meshBuilder.track_mesh(
{
cameraPos: Rsed.world.camera.position_floored(),
cameraPosFloat: (cameraMovement.isMobileControls? Rsed.world.camera.position() : Rsed.world.camera.position_floored()), // Smooth scrolling on mobile, tile-based otherwise.
solidProps: sceneSettings.showProps,
includeWireframe: sceneSettings.showWireframe,
paintHoverPala: sceneSettings.showHoverPala,
});
// Transform the n-gons into screen space using Rally-Sport's one-point perspective.
{
// The vanishing point. Defaults to the top middle of the screen, like in
// the game.
const vanishX = (Rngon.renderable_width_of(Rsed.visual.canvas.domElement, Rsed.visual.canvas.scalingFactor) / 2);
const vanishY = (4 - (Rsed.world.camera.vertical_zoom() * 2));
for (const ngon of trackMesh.ngons)
{
// We don't want the renderer applying proper perspective projection.
ngon.material.allowTransform = false;
for (const vertex of ngon.vertices)
{
// Tweak the ground mesh's positioning so it matches the game's.
vertex.y *= -1;
vertex.x += (Rsed.constants.groundTileSize * 2);
vertex.y += (Rsed.constants.groundTileSize * 1);
vertex.z += (Rsed.constants.groundTileSize * 14.5);
// Transform the vertex into screen space via simple depth division
// toward the vanishing point.
const z = Math.max(Number.MIN_VALUE, (vertex.z / 600));
vertex.x = (vanishX + ((vertex.x - vanishX) / z));
vertex.y = (vanishY + ((vertex.y - vanishY) / z));
}
}
}
const renderInfo = Rngon.render(Rsed.visual.canvas.domElement.getAttribute("id"), [trackMesh],
{
cameraPosition: Rngon.translation_vector(0, 0, 0),
cameraDirection: Rsed.world.camera.rotation(),
scale: Rsed.visual.canvas.scalingFactor,
fov: 30,
nearPlane: 300,
farPlane: 10000,
clipToViewport: true,
depthSort: "painter",
useDepthBuffer: false,
auxiliaryBuffers: [{buffer:Rsed.visual.canvas.mousePickingBuffer, property:"mousePickId"}],
modules: {
ngonFill: Rsed.minimal_rngon_filler,
transformClipLight: Rsed.minimal_rngon_tcl,
},
});
// If the rendering was resized since the previous frame...
if ((renderInfo.renderWidth !== Rsed.visual.canvas.width ||
(renderInfo.renderHeight !== Rsed.visual.canvas.height)))
{
Rsed.visual.canvas.width = renderInfo.renderWidth;
Rsed.visual.canvas.height = renderInfo.renderHeight;
window.close_dropdowns();
}
return;
},
handle_user_interaction: function()
{
handle_mouse_input();
update_cursor_graphic();
/// EXPERIMENTAL. Temporary testing of mobile controls.
const touchDelta = Rsed.ui.inputState.get_touch_move_delta();
Rsed.world.camera.move_camera(-touchDelta.x, 0, -touchDelta.y);
Rsed.visual.canvas.mousePickingBuffer.fill(null);
},
});
function move_camera()
{
cameraMovement.isMobileControls = Rsed.browserMetadata.isMobile;
cameraMovement.msSinceLastUpdate += Rsed.core.tick_time_delta_ms();
if (cameraMovement.isMobileControls)
{
const movementSpeed = (0.03 * Rsed.core.tick_time_delta_ms());
const cameraMoveVector = Rngon.vector3((cameraMovement.up? -1 : cameraMovement.down? 1 : 0),
0,
(cameraMovement.left? -1 : cameraMovement.right? 1 : 0));
Rngon.vector3.normalize(cameraMoveVector);
/// TODO: Implement Rngon.vector3.scale(movementMult).
cameraMoveVector.x *= (movementSpeed * 0.5);
cameraMoveVector.y *= movementSpeed;
cameraMoveVector.z *= movementSpeed;
Rsed.world.camera.move_camera(cameraMoveVector.x, cameraMoveVector.y, cameraMoveVector.z);
}
else
{
const msIntervalToMoveCamera = 30;
if (cameraMovement.msSinceLastUpdate > msIntervalToMoveCamera)
{
const movementMult = Math.round(cameraMovement.msSinceLastUpdate / msIntervalToMoveCamera);
const cameraMoveVector = Rngon.vector3((movementMult * (cameraMovement.up? -1 : cameraMovement.down? 1 : 0)),
0,
(movementMult * (cameraMovement.left? -1 : cameraMovement.right? 1 : 0)));
Rsed.world.camera.move_camera(cameraMoveVector.x, cameraMoveVector.y, cameraMoveVector.z);
cameraMovement.msSinceLastUpdate = 0;
}
}
return;
}
function update_cursor_graphic()
{
const cursors = Rsed.ui.cursorHandler.cursors;
const currentCursor = (()=>
{
const mouseHover = Rsed.ui.inputState.current_mouse_hover();
const mouseGrab = Rsed.ui.inputState.current_mouse_grab();
if (mouseGrab && (mouseGrab.type == "prop"))
{
if (Rsed.ui.inputState.right_mouse_button_down())
{
return cursors.openHand2;
}
return cursors.closedHand;
}
if (mouseHover)
{
switch (mouseHover.type)
{
case "prop": return cursors.openHand;
case "ground":
{
if (Rsed.ui.inputState.key_down("tab"))
{
return cursors.eyedropper;
}
}
}
}
if (Rsed.ui.groundBrush.brushSmoothens)
{
return cursors.groundSmoothing;
}
return cursors.default;
})();
Rsed.ui.cursorHandler.set_cursor(currentCursor);
return;
}
function handle_mouse_input()
{
if (Rsed.ui.inputState.mouse_wheel_scroll())
{
Rsed.world.camera.zoom_vertically(-Rsed.ui.inputState.mouse_wheel_scroll() / 2);
Rsed.ui.inputState.reset_wheel_scroll();
}
if (Rsed.ui.inputState.mouse_button_down())
{
// Note: A mouse grab can be either a transient click or a longer
// press.
const grab = Rsed.ui.inputState.current_mouse_grab();
const hover = Rsed.ui.inputState.current_mouse_hover();
if (!grab) return;
switch (grab.type)
{
case "ground":
{
// Note: We'll access the mouse-picking info via hover instead of grab,
// since grab will be the tile over which the user pressed down the
// mouse button regardless of whether the mouse is moved after that;
// while hover indicates the tile over which the mouse - with the button
// held down - is currently over.
if (!hover) break;
if (hover.type !== "ground") break;
// Eyedropper.
if (Rsed.ui.inputState.left_mouse_button_down() &&
Rsed.ui.inputState.left_mouse_click_modifiers().includes("tab"))
{
const palaIdx = Rsed.core.current_project().varimaa.tile_at(hover.groundTileX, hover.groundTileY);
Rsed.ui.groundBrush.set_brush_pala_idx(palaIdx);
break;
}
// Add a new prop.
if (Rsed.ui.inputState.left_mouse_button_down() &&
Rsed.ui.inputState.left_mouse_click_modifiers().includes("shift"))
{
Rsed.ui.assetMutator.user_edit("prop", {
command: "add",
target: Rsed.core.current_project().props.id_for_name("tree"),
data: {
x: (hover.groundTileX * Rsed.constants.groundTileSize),
z: (hover.groundTileY * Rsed.constants.groundTileSize),
},
});
Rsed.ui.inputState.reset_mouse_hover();
Rsed.ui.inputState.reset_mouse_grab();
break;
}
// Raise/lower the terrain.
if (Rsed.ui.inputState.left_mouse_button_down() ||
Rsed.ui.inputState.right_mouse_button_down())
{
// Left button raises, right button lowers. Holding down Ctrl  reduces
// the rate of change.
const delta = (Rsed.ui.inputState.left_mouse_button_down()? 2 : -2);
Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changeHeight,
delta,
hover.groundTileX,
hover.groundTileY);
break;
}
// Paint the terrain.
if (!Rsed.ui.inputState.key_down("shift") &&
Rsed.ui.inputState.mid_mouse_button_down())
{
Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changePala,
Rsed.ui.groundBrush.brush_pala_idx(),
hover.groundTileX,
hover.groundTileY);
break;
}
break;
}
case "prop":
{
if (Rsed.ui.inputState.left_mouse_button_down())
{
// Remove the selected prop.
if (Rsed.ui.inputState.left_mouse_click_modifiers().includes("shift"))
{
Rsed.ui.assetMutator.user_edit("prop", {
command: "remove",
target: hover.propTrackIdx,
});
Rsed.ui.inputState.reset_mouse_hover();
Rsed.ui.inputState.reset_mouse_grab();
}
// Drag the prop.
else
{
// For now, don't allow moving the starting line (always prop #0).
if (grab.propTrackIdx === 0)
{
Rsed.alert("The finish line can't be moved.");
// Prevent the same input from registering again next frame, before
// the user has had time to release the mouse button.
Rsed.ui.inputState.reset_mouse_buttons_state();
break;
}
else
{
const mousePosDelta =
{
x: (Rsed.ui.inputState.mouse_pos().x - prevMousePos.x),
y: (Rsed.ui.inputState.mouse_pos().y - prevMousePos.y),
}
Rsed.ui.assetMutator.user_edit("prop", {
command: "move",
target: grab.propTrackIdx,
data: {
x: (mousePosDelta.x * 1.5),
z: (mousePosDelta.y * 5),
},
});
}
}
}
break;
}
default: break;
}
}
prevMousePos = Rsed.ui.inputState.mouse_pos();
return;
}
})();
/*
* Most recent known filename: js/scenes/scene-tilemap.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
Rsed.scenes = Rsed.scenes || {};
// A top-down view of the project's tilemap. The user can edit the tilemap via mouse
// interaction.
Rsed.scenes["tilemap"] = (function()
{
/// Temp hack. Lets the renderer know that we want it to update mouse hover information
/// once the next frame has finished rendering. This is used e.g. to keep proper track
/// mouse hover when various UI elements are toggled on/off.
let updateMouseHoverOnFrameFinish = false;
let tilemap = []; // The tilemap view's pixels, in consecutive RGBA (0-255) values.
let tilemapMesh = null; // A retro n-gon renderer mesh.
let tilemapWidth = 0;
let tilemapHeight = 0;
let tilemapOffsetX = 0;
let tilemapOffsetY = 0;
// The latest known size of the canvas we're rendering to.
let knownCanvasSizeX = 0;
let knownCanvasSizeY = 0;
const sceneSettings = {
// Whether to show the PALAT pane; i.e. a side panel that displays all the available
// PALA textures.
showPalatPane: false,
};
// Load UI components.
let uiComponents = null;
(async()=>
{
uiComponents = {
activePala:   Rsed.ui.component.activePala.instance(),
palatPane:    Rsed.ui.component.palatPane.instance(),
fpsIndicator: Rsed.ui.component.fpsIndicator.instance(),
footer: Rsed.ui.component.label.instance(),
};
})();
const scene = Rsed.scene(
{
// Refreshes the tilemap view with any new changes to the track's tilemap.
// Optionally, you can provide the extent of a dirty rectangle: its top
// left corner is at startX,startY, and it's of the given width and height.
// Unless a dirty rectangle is given, the entire tilemap view will be
// refreshed.
refresh_tilemap_view: function(startX = 0, startY = 0, width = -1, height = -1)
{
const project = Rsed.core.current_project();
const checkpoint = project.track_checkpoint();
if (Rsed.visual.canvas.width != knownCanvasSizeX ||
Rsed.visual.canvas.height != knownCanvasSizeY)
{
tilemapWidth = Math.round(Rsed.visual.canvas.width * 0.7);
tilemapHeight = Math.round(Rsed.visual.canvas.height * 0.7);
tilemapOffsetX = Math.floor((Rsed.visual.canvas.width / 2) - (tilemapWidth / 2));
tilemapOffsetY = Math.floor((Rsed.visual.canvas.height / 2) - (tilemapHeight / 2));
tilemap = new Array(project.varimaa.width * project.varimaa.height);
knownCanvasSizeX = Rsed.visual.canvas.width;
knownCanvasSizeY = Rsed.visual.canvas.height;
}
const maxX = ((width == -1)? project.varimaa.width : Math.min(project.varimaa.width, (width + startX)));
const maxY = ((height == -1)? project.varimaa.height : Math.min(project.varimaa.height, (height + startY)));
// Refresh the tilemap texture.
for (let y = startY; y < maxY; y++)
{
for (let x = startX; x < maxX; x++)
{
const pala = project.palat.texture[project.varimaa.tile_at(x, y)];
let colorIdx = ((pala == null)? 0 : pala.indices[1]);
if ((x == checkpoint.x) &&
(y == checkpoint.y))
{
colorIdx = "white";
}
const color = Rsed.visual.palette.color_at_idx(colorIdx);
tilemap[(x + y * project.varimaa.width) * 4 + 0] = color.red;
tilemap[(x + y * project.varimaa.width) * 4 + 1] = color.green;
tilemap[(x + y * project.varimaa.width) * 4 + 2] = color.blue;
tilemap[(x + y * project.varimaa.width) * 4 + 3] = 255;
}
}
// The tilemap n-gon is a rectangle drawn with the tilemap texture.
const tilemapNgon = Rngon.ngon([Rngon.vertex(tilemapOffsetX, tilemapOffsetY),
Rngon.vertex((tilemapOffsetX + tilemapWidth), tilemapOffsetY),
Rngon.vertex((tilemapOffsetX + tilemapWidth), (tilemapOffsetY + tilemapHeight)),
Rngon.vertex(tilemapOffsetX, (tilemapOffsetY + tilemapHeight))],
{
color: Rngon.color_rgba(255, 255, 255),
allowTransform: false, // The vertices are already in screen space.
texture: Rngon.texture_rgba({
width: project.varimaa.width,
height: project.varimaa.height,
pixels: tilemap,
}),
hasWireframe: true,
wireframeColor: Rngon.color_rgba(255, 255, 0),
});
tilemapMesh = Rngon.mesh([tilemapNgon]);
return;
},
on_key_fire: function(key, repeat = false)
{
function key_is(compared)
{
return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
}
if (key_is("z"))
{
if (Rsed.ui.inputState.key_down("control") &&
Rsed.ui.inputState.key_down("shift"))
{
Rsed.ui.undoStack.redo();
scene.refresh_tilemap_view();
}
else if (Rsed.ui.inputState.key_down("control"))
{
Rsed.ui.undoStack.undo();
scene.refresh_tilemap_view();
}
}
else if (key_is("y") &&
Rsed.ui.inputState.key_down("control") )
{
Rsed.ui.undoStack.redo();
}
else if (key_is("q"))
{
Rsed.core.set_scene("3d");
}
else if (key_is("a") && !repeat)
{
sceneSettings.showPalatPane = !sceneSettings.showPalatPane;
// Prevent a mouse click from acting on the ground behind the pane when the pane
// is brought up, and on the pane when the pane has been removed.
updateMouseHoverOnFrameFinish = true;
}
else
{
for (const brushSizeKey of ["1", "2", "3", "4", "5"])
{
if (key_is(brushSizeKey))
{
Rsed.ui.groundBrush.set_brush_size((brushSizeKey == 5)? 8 : (brushSizeKey - 1));
}
}
}
return;
},
draw_ui: function()
{
Rsed.ui.draw.begin_drawing(Rsed.visual.canvas);
if (uiComponents) // Once the UI components have finished async loading...
{
uiComponents.activePala.update(sceneSettings);
uiComponents.activePala.draw((Rsed.visual.canvas.width - 20), 11);
uiComponents.footer.update(`Tilemap size: ${Rsed.core.current_project().maasto.width} * ${Rsed.core.current_project().maasto.width}`);
uiComponents.footer.draw(0, (Rsed.visual.canvas.height - Rsed.ui.font.nativeHeight - 2));
if (sceneSettings.showPalatPane)
{
uiComponents.palatPane.update(sceneSettings);
uiComponents.palatPane.draw((Rsed.visual.canvas.width - 4), 31);
}
if (Rsed.core.fps_counter_enabled())
{
uiComponents.fpsIndicator.update(sceneSettings);
uiComponents.fpsIndicator.draw(3, 10);
}
}
Rsed.ui.draw.finish_drawing(Rsed.visual.canvas);
// Note: We assume that UI drawing is the last step in rendering the current
// frame; and thus that once the UI rendering has finished, the frame is finished
// also.
if (updateMouseHoverOnFrameFinish)
{
Rsed.ui.inputState.update_mouse_hover();
updateMouseHoverOnFrameFinish = false;
}
return;
},
draw_mesh: function()
{
if ((Rsed.visual.canvas.width != knownCanvasSizeX ||
Rsed.visual.canvas.height != knownCanvasSizeY))
{
this.refresh_tilemap_view();
}
const renderInfo = Rngon.render(Rsed.visual.canvas.domElement.getAttribute("id"), [tilemapMesh],
{
scale: Rsed.visual.canvas.scalingFactor,
fov: 45,
nearPlane: 0,
farPlane: 10,
depthSort: "painter",
useDepthBuffer: false,
});
// If the rendering was resized since the previous frame...
if ((renderInfo.renderWidth !== Rsed.visual.canvas.width ||
(renderInfo.renderHeight !== Rsed.visual.canvas.height)))
{
Rsed.visual.canvas.width = renderInfo.renderWidth;
Rsed.visual.canvas.height = renderInfo.renderHeight;
window.close_dropdowns();
}
return;
},
handle_user_interaction: function()
{
handle_mouse_input();
update_cursor_graphic();
Rsed.visual.canvas.mousePickingBuffer.fill(null);
},
});
return scene;
function update_cursor_graphic()
{
const cursors = Rsed.ui.cursorHandler.cursors;
const mousePos = Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution();
const mouseTilemapPosX = Math.round((mousePos.x - tilemapOffsetX) * (Rsed.core.current_project().maasto.width / tilemapWidth));
const mouseTilemapPosY = Math.round((mousePos.y - tilemapOffsetY) * (Rsed.core.current_project().maasto.height / tilemapHeight));
const isCursorOnTilemap = ((mouseTilemapPosX >= 0) &&
(mouseTilemapPosY >= 0) &&
(mouseTilemapPosX < Rsed.core.current_project().maasto.width) &&
(mouseTilemapPosY < Rsed.core.current_project().maasto.height));
if (isCursorOnTilemap)
{
Rsed.ui.cursorHandler.set_cursor(cursors.pencil);
}
else
{
Rsed.ui.cursorHandler.set_cursor(cursors.default);
}
return;
}
function handle_mouse_input()
{
const mousePos = Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution();
// Handle painting the tilemap.
if (Rsed.ui.inputState.mouse_button_down())
{
const mouseTilemapPosX = Math.round((mousePos.x - tilemapOffsetX) * (Rsed.core.current_project().maasto.width / tilemapWidth));
const mouseTilemapPosY = Math.round((mousePos.y - tilemapOffsetY) * (Rsed.core.current_project().maasto.height / tilemapHeight));
const brushSize = (Rsed.ui.groundBrush.brush_size() + 1);
Rsed.ui.groundBrush.apply_brush_to_terrain(Rsed.ui.groundBrush.brushAction.changePala,
Rsed.ui.groundBrush.brush_pala_idx(),
mouseTilemapPosX,
mouseTilemapPosY);
// Update the region of the tilemap that we painted over.
scene.refresh_tilemap_view((mouseTilemapPosX - brushSize),
(mouseTilemapPosY - brushSize),
(brushSize * 2),
(brushSize * 2));
}
return;
}
})();
/*
* Most recent known filename: js/scenes/scene-texture.js
*
* 2019 Tarpeeksi Hyvae Soft /
* RallySportED-js
*
*/
"use strict";
Rsed.scenes = Rsed.scenes || {};
// A view of a given texture, allowing the user to modify the texture's pixels.
Rsed.scenes["texture"] = (function()
{
// A reference to the Rsed.visual.texture() object that we're to edit.
let texture = null;
// Texture pixels copied with Ctrl + C.
let clipboard;
reset_clipboard();
// The amount by which the user has moved the texture's position in the view.
let textureUserOffsetX = 0;
let textureUserOffsetY = 0;
let textureZoom = 1;
// A buffer in which we store mouse-picking information about the rendering - so for
// each pixel on-screen, we can tell to which part of the texture the pixel corresponds.
const textureMousePickBuffer = [];
const sceneSettings = {
// Which color (index to Rally-Sport's palette) to paint with.
penColorIdx: false,
// Whether to show the PALAT pane; i.e. a side panel that displays all the available
// PALA textures.
showPalatPane: true,
};
// In which direction(s) the camera is currently moving. This is affected
// by e.g. user input.
const cameraMovement = {
up: false,
down: false,
left: false,
right: false,
};
// Load UI components.
let uiComponents = null;
(async()=>
{
uiComponents = {
fpsIndicator: Rsed.ui.component.fpsIndicator.instance(),
colorSelector: Rsed.ui.component.colorSelector.instance(),
textureLabel: Rsed.ui.component.label.instance(),
zoomLabel: Rsed.ui.component.label.instance(),
clipboardLabel: Rsed.ui.component.label.instance(),
palatPane: Rsed.ui.component.palatPane.instance({
selectionCallback: (palaIdx)=>scene.set_texture(Rsed.core.current_project().palat.texture[palaIdx]),
indicateSelection: false,
}),
};
})();
const scene = Rsed.scene(
{
// Assign the texture to be edited. Must be either an instance of Rsed.visual.texture
// or an object that implements Rsed.visual.texture's public API.
set_texture: function(tex)
{
texture = tex;
},
on_key_release: function(key)
{
function key_is(compared)
{
return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
}
if (key_is("s"))
{
cameraMovement.up = false;
}
else if (key_is("f"))
{
cameraMovement.down = false;
}
else if (key_is("e"))
{
cameraMovement.left = false;
}
else if (key_is("d"))
{
cameraMovement.right = false;
}
return;
},
on_key_fire: function(key, repeat = false)
{
function key_is(compared)
{
return (key.localeCompare(compared, undefined, {sensitivity: "accent"}) == 0);
}
if (key_is("s"))
{
cameraMovement.up = true;
}
else if (key_is("f"))
{
cameraMovement.down = true;
}
else if (key_is("e"))
{
cameraMovement.left = true;
}
else if (key_is("d"))
{
cameraMovement.right = true;
}
else if (key_is("a") && !repeat)
{
sceneSettings.showPalatPane = !sceneSettings.showPalatPane;
}
else if (key_is("z"))
{
if (Rsed.ui.inputState.key_down("control") &&
Rsed.ui.inputState.key_down("shift"))
{
Rsed.ui.undoStack.redo();
}
else if (Rsed.ui.inputState.key_down("control"))
{
Rsed.ui.undoStack.undo();
}
}
else if (key_is("c") &&
Rsed.ui.inputState.key_down("control"))
{
copy_to_clipboard(texture);
}
else if (key_is("v") &&
Rsed.ui.inputState.key_down("control"))
{
paste_from_clipboard();
}
else if (key_is("r"))
{
texture = rotated(texture);
}
else if (key_is("y") &&
Rsed.ui.inputState.key_down("control") )
{
Rsed.ui.undoStack.redo();
}
else if (key_is("q"))
{
Rsed.core.set_scene("3d");
Rsed.ui.inputState.set_key_down("q", false);
}
else
{
for (const brushSizeKey of ["1", "2", "3", "4", "5"])
{
if (key_is(brushSizeKey))
{
Rsed.ui.groundBrush.set_brush_size((brushSizeKey == 5)? 8 : (brushSizeKey - 1));
}
}
}
return;
},
draw_ui: function()
{
if (!texture)
{
Rsed.throw_if(Rsed.core.current_project().isPlaceholder,
"Expected project data to have been loaded already.");
this.set_texture(Rsed.core.current_project().palat.texture[3]);
}
Rsed.ui.draw.begin_drawing(Rsed.visual.canvas);
if (uiComponents) // Once the UI components have finished async loading...
{
uiComponents.colorSelector.update(sceneSettings);
uiComponents.colorSelector.draw((Rsed.visual.canvas.width - 101), 11);
uiComponents.textureLabel.update(`Texture: ${texture.width} * ${texture.height}`);
uiComponents.textureLabel.draw(0, (Rsed.visual.canvas.height - (Rsed.ui.font.nativeHeight * 2) - 5));
uiComponents.clipboardLabel.update(clipboard
? `Clipboard: ${clipboard.width} * ${clipboard.height}${(clipboard.source == texture)? " (this)" : ""}`
: "Clipboard: empty");
uiComponents.clipboardLabel.draw(0, (Rsed.visual.canvas.height - Rsed.ui.font.nativeHeight - 2));
{
const truncatedZoomValue = (1 / textureZoom).toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
uiComponents.zoomLabel.update(`Zoom: ${truncatedZoomValue}*`);
uiComponents.zoomLabel.draw(0, (Rsed.visual.canvas.height - (Rsed.ui.font.nativeHeight * 3) - 8));
}
if (Rsed.core.fps_counter_enabled())
{
uiComponents.fpsIndicator.draw(3, 10);
}
if (sceneSettings.showPalatPane)
{
uiComponents.palatPane.update(sceneSettings);
uiComponents.palatPane.draw((Rsed.visual.canvas.width - 4), 47);
}
}
Rsed.ui.draw.finish_drawing(Rsed.visual.canvas);
return;
},
draw_mesh: function()
{
if (!texture)
{
Rsed.throw_if(Rsed.core.current_project().isPlaceholder,
"Expected project data to have been loaded already.");
this.set_texture(Rsed.core.current_project().palat.texture[3]);
}
// Update the camera's position.
{
const direction = Rngon.vector3(0, 0, 0);
const movementSpeed = 0.5;
if (cameraMovement.left) direction.y += -1;
if (cameraMovement.right) direction.y += 1;
if (cameraMovement.up) direction.x += -1;
if (cameraMovement.down) direction.x +=  1;
Rngon.vector3.normalize(direction);
textureUserOffsetX += (direction.x * movementSpeed);
textureUserOffsetY += (direction.y * movementSpeed);
}
textureMousePickBuffer.length = 0;
const textureNgon = Rngon.ngon([Rngon.vertex(0, 0, (textureZoom * 50), 0, 0),
Rngon.vertex(texture.width, 0, (textureZoom * 50), 1, 0),
Rngon.vertex(texture.width, texture.height, (textureZoom * 50), 1, 1),
Rngon.vertex(0, texture.height, (textureZoom * 50), 0, 1)],
{
color: Rngon.color_rgba(255, 255, 255),
texture: texture,
hasWireframe: true,
wireframeColor: Rngon.color_rgba(255, 255, 0),
textureMapping: "affine",
uvWrapping: "clamp",
allowAlphaReject: false,
});
const renderInfo = Rngon.render(Rsed.visual.canvas.domElement.getAttribute("id"), [Rngon.mesh([textureNgon])],
{
cameraPosition: Rngon.translation_vector(-textureUserOffsetX, textureUserOffsetY, 0),
scale: Rsed.visual.canvas.scalingFactor,
fov: 45,
nearPlane: 0,
farPlane: 10000,
depthSort: "painter",
useDepthBuffer: false,
// For each pixel we're rendered, mark its texture UV coordinates into our
// mouse-picking buffer.
pixelShaderFunction: function({renderWidth, renderHeight, fragmentBuffer})
{
for (let i = 0; i < (renderWidth * renderHeight); i++)
{
const u = (fragmentBuffer[i].textureUScaled == null)
? null
: Math.max(0, Math.min((texture.width - 1), fragmentBuffer[i].textureUScaled));
const v = (fragmentBuffer[i].textureVScaled == null)
? null
: Math.max(0, Math.min((texture.height - 1), fragmentBuffer[i].textureVScaled));
textureMousePickBuffer[i] = {u, v};
// Reset the fragment buffer as we go along, since the renderer doesn't at the
// time of writing this clear the fragment buffer at the beginning of each frame.
fragmentBuffer[i].textureUScaled = null;
fragmentBuffer[i].textureVScaled = null;
}
},
});
// If the rendering was resized since the previous frame...
if ((renderInfo.renderWidth !== Rsed.visual.canvas.width ||
(renderInfo.renderHeight !== Rsed.visual.canvas.height)))
{
Rsed.visual.canvas.width = renderInfo.renderWidth;
Rsed.visual.canvas.height = renderInfo.renderHeight;
window.close_dropdowns();
}
return;
},
handle_user_interaction: function()
{
handle_mouse_input();
update_cursor_graphic();
Rsed.visual.canvas.mousePickingBuffer.fill(null);
},
});
return scene;
function rotated(texture)
{
if (!texture)
{
Rsed.ui.popup_notification("No texture data to rotate.", {
notificationType: "error",
});
return texture;
}
if (texture.width != texture.height)
{
Rsed.ui.popup_notification("Only square textures can be rotated.", {
notificationType: "warning",
});
return texture;
}
const indices = [...texture.indices];
// Rotate 90 degrees.
for (let y = 0; y < (texture.height - 1); y++)
{
for (let x = y; x < texture.width; x++)
{
const idx1 = (x + y * texture.width);
const idx2 = (y + x * texture.width);
[indices[idx1], indices[idx2]] = [indices[idx2], indices[idx1]];
}
}
// Mirror.
for (let x = 0; x < (texture.width / 2); x++)
{
for (let y = 0; y < texture.height; y++)
{
const idx1 = (x + y * texture.width);
const idx2 = ((texture.width - 1 - x) + y * texture.width);
[indices[idx1], indices[idx2]] = [indices[idx2], indices[idx1]];
}
}
return Rsed.ui.assetMutator.user_edit("texture", {
command: "set-all-pixels",
target: {texture},
data: indices,
});
}
function reset_clipboard()
{
clipboard = undefined;
return;
}
function copy_to_clipboard(texture)
{
if (!texture)
{
Rsed.ui.popup_notification("No texture to copy.", {
notificationType: "error",
});
return;
}
clipboard = {
width: texture.width,
height: texture.height,
colorIndices: [...texture.indices],
source: texture,
};
return;
}
function paste_from_clipboard()
{
if (!clipboard)
{
Rsed.ui.popup_notification("The clipboard is empty.", {
notificationType: "warning",
});
return;
}
if ((texture.width != clipboard.width) ||
(texture.height != clipboard.height))
{
Rsed.ui.popup_notification("The clipboard's resolution doesn't match. It can't be pasted here.", {
notificationType: "warning",
});
return;
}
// Note: Changing a pixel in the texture causes the texture to be regenerated,
// so we need to update our reference to it. (The new reference is returned
// from the pixel-setting function.)
texture = Rsed.ui.assetMutator.user_edit("texture", {
command: "set-all-pixels",
target: {texture},
data: clipboard.colorIndices,
});
return;
}
function update_cursor_graphic()
{
const cursors = Rsed.ui.cursorHandler.cursors;
const mousePos = Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution();
const pickElement = textureMousePickBuffer[mousePos.x + mousePos.y * Rsed.visual.canvas.width];
const isCursorOnTexture = (pickElement && (pickElement.u !== null) && (pickElement.v !== null));
const newCursor = (()=>
{
if (isCursorOnTexture)
{
if (Rsed.ui.inputState.key_down("tab"))
{
return cursors.eyedropper;
}
else
{
return cursors.pencil;
}
}
else
{
return cursors.default;
}
})();
Rsed.ui.cursorHandler.set_cursor(newCursor);
return;
}
function handle_mouse_input()
{
if (!texture)
{
return;
}
const mousePos = Rsed.ui.inputState.mouse_pos_scaled_to_render_resolution();
// Handle painting the texture.
if (Rsed.ui.inputState.mouse_button_down())
{
const pickElement = textureMousePickBuffer[mousePos.x + mousePos.y * Rsed.visual.canvas.width];
const isCursorOnTexture = (pickElement && (pickElement.u !== null) && (pickElement.v !== null));
if (isCursorOnTexture)
{
const colorIdxUnderCursor = texture.indices[pickElement.u + pickElement.v * texture.width];
// Eyedropper.
if (Rsed.ui.inputState.key_down("tab"))
{
uiComponents.colorSelector.set_color_idx(colorIdxUnderCursor);
// Only allow the eyedropper to select one pixel per click, so you don't get
// flicker in the color selector if the mouse is moved while holding the click.
Rsed.ui.inputState.reset_mouse_buttons_state();
}
else
{
if (colorIdxUnderCursor !== sceneSettings.penColorIdx)
{
// Note: Changing a pixel in the texture causes the texture to be regenerated,
// so we need to update our reference to it. (The new reference is returned
// from the pixel-setting function.)
texture = Rsed.ui.assetMutator.user_edit("texture", {
command: "set-pixel",
target: {
texture,
u: pickElement.u,
v: pickElement.v,
},
data: sceneSettings.penColorIdx,
});
}
}
}
}
else if (Rsed.ui.inputState.mouse_wheel_scroll())
{
textureZoom += (.1 * Math.sign(Rsed.ui.inputState.mouse_wheel_scroll()));
Rsed.ui.inputState.reset_wheel_scroll();
}
return;
}
})();
/*
* Most recent known filename: js/stream/stream.js
*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// A one-to-many network where viewers are connected to a streamer who sends them
// data. For a client to take part in this network, it will call Rsed.stream.start()
// with a role it wishes to take - either a "viewer" (Rsed.stream.viewer) or a
// "streamer" (Rsed.stream.streamer).
Rsed.stream = (function()
{
// Either Rsed.stream.streamer or Rsed.stream.viewer.
let stream = null;
let connectionCheckInterval = null;
// Functions callable by the stream objects to inform RallySportED of
// various events.
const signalsFns = {
signal_stream_status: function(status = "unknown")
{
Rsed.ui.htmlUI.set_stream_status(status);
Rsed.ui.htmlUI.set_stream_viewer_count(stream.num_connections());
},
// Call this to signal to RallySportED that the stream has ended.
signal_stream_closed: function(streamId)
{
signalsFns.signal_stream_status("disabled");
Rsed.log(`Left stream ${streamId}.`);
clearInterval(connectionCheckInterval);
connectionCheckInterval = null;
// Remove the stream id from the address bar.
/// TODO: A less brute force implementation.
if (stream.role !== "viewer")
{
const basePath = `//${location.host}${location.pathname}`;
window.history.replaceState({}, document.title, basePath);
}
return;
},
// Call this to signal to RallySportED that the stream has started.
signal_stream_open: function(role, streamId)
{
Rsed.throw_if(!stream, "stream.signal_stream_open() called on a closed stream.");
signalsFns.signal_stream_status(role);
Rsed.log(`Joined stream ${streamId}.`);
// Replace the URL bar's contents to give the user a link they can
// share to others to join the stream.
/// TODO: A less brute force implementation.
if (stream.role !== "viewer")
{
const basePath = `//${location.host}${location.pathname}?transientServer=${streamId}`;
window.history.replaceState({}, document.title, basePath);
}
// Periodically refresh our list of open connections.
connectionCheckInterval = setInterval(()=>
{
Rsed.ui.htmlUI.set_stream_viewer_count(stream.num_connections());
}, 2000);
},
signal_stream_error: function(error)
{
Rsed.ui.popup_notification(`Stream ${error}`, {
notificationType: "error",
});
return;
},
};
const publicInterface = {
// If 'role' is "streamer" or "server", 'proposedId' is the id with which viewers
// can connect to the stream. If 'role' is "viewer", 'proposedId' is the id of
// the streamer that the viewer wants to connect to.
start: function(role = null, proposedId = Rsed.stream.generate_random_stream_id())
{
Rsed.throw_if(!role, "A role must be specified for stream.start().");
Rsed.throw_if(!Rsed.stream[role], `Unknown stream role "${role}".`);
if (stream)
{
stream.stop();
}
stream = Rsed.stream[role](proposedId, signalsFns);
stream.start();
return;
},
stop: function()
{
if (!stream)
{
return;
}
stream.stop();
stream = null;
return;
},
// Encapsulates the given data into an object that is then streamed to the
// current viewers (if 'dstViewer' is null) or to a specific viewer (as identified
// by 'dstViewer').
//
// The 'what' argument is a string that identifies the type of data encapsulated
// - valid values are "track-project-data" ('data' is expected to contain a track's
// entire data: container, manifesto, and metadata), and "user-edit" ('data' is
// expected to contain the arguments for a call to Rsed.ui.assetMutator.user_edit()).
//
// 'headerExtra' allows the caller to insert additional parameters to the header,
// or to overwrite the default parameters.
send_packet: function(what = "",
data,
dstViewer = null,
headerExtra = {})
{
if (!stream)
{
return;
}
const packet = {
header: {
what,
creatorId: stream.id,
createdOn: Date.now(),
keepAlive: true,
...headerExtra,
},
data,
};
Rsed.throw_if(!publicInterface.is_validly_formed_packet(packet),
"stream.send_packet() has created a malformed stream packet.");
stream.send(packet, dstViewer);
return;
},
// Returns true if the given stream packet is validly formed (contains the
// required parameters, etc.); false otherwise.
is_validly_formed_packet: function(packet)
{
if ((typeof packet !== "object") ||
(typeof packet.header !== "object") ||
(typeof packet.header.what === "undefined") ||
(typeof packet.header.creatorId === "undefined") ||
(typeof packet.header.createdOn !== "number") ||
(typeof packet.header.keepAlive !== "boolean") ||
(typeof packet.data === "undefined"))
{
return false;
}
return true;
},
get role()
{
return (stream? stream.role : null);
},
};
return publicInterface;
})();
Rsed.stream.localhostPeerJsServerConfig = {
host: "localhost",
port: 9000,
path: "./",
};
Rsed.stream.herokuPeerJsServerConfig = {
secure: true,
host: "peerjs-tarpeeksihyvaesoft.herokuapp.com",
port: 443,
};
// The configuration that will be used for PeerJS's Peer().
Rsed.stream.peerJsServerConfig = Rsed.stream.herokuPeerJsServerConfig;
// Returns a random id that can be used as the id of a peer in a stream.
Rsed.stream.generate_random_stream_id = function()
{
const alphaSrc = ["a", "c", "d", "e", "h", "k", "n", "s", "u"];
const numericSrc = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const alphanumeric = [..."000111000"].map(v=>
{
const src = ((v == "0")? alphaSrc : numericSrc);
return src[Math.floor(Math.random() * src.length)];
});
return alphanumeric.join("");
};
/*
* Most recent known filename: js/stream/server.js
*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// Server is an Rsed.stream() role in a one-to-many network. Clients who are servers
// accept connections from viewers, sending them the server client's current project
// data and then closing the connection.
Rsed.stream.server = function(streamId, signalFns)
{
let numViewersServed = 0;
// PeerJS's Peer() object.
let peer = null;
const publicInterface = {
role: "server",
num_connections: function()
{
return numViewersServed;
},
// Sends the given data packet to the given viewer.
send: function(packet, dstViewer = null)
{
Rsed.throw_if_not_type("object", packet,  packet.header);
Rsed.throw_if(!dstViewer,
"A destination is required for stream.server.send().");
Rsed.throw_if(!["project-data"].includes(packet.header.what),
"A stream server can't send this type of packet.");
dstViewer.send(packet);
return;
},
// Servers don't receive data, they just ignore requests to do so.
receive: function(){},
// Start serving.
start: function()
{
numViewersServed = 0;
if (status.active)
{
Rsed.log("Attempted to start a new server stream while an existing stream was still active. Ignoring this.");
return;
}
signalFns.signal_stream_status("initializing");
peer = new Peer(streamId, Rsed.stream.peerJsServerConfig);
peer.on("close", ()=>signalFns.signal_stream_closed(streamId));
peer.on("error", (error)=>
{
publicInterface.stop();
signalFns.signal_stream_error(error);
});
peer.on("open", (id)=>
{
if (id != streamId)
{
Rsed.ui.popup_notification("Stream: Received an invalid ID from the peer server.", {
notificationType: "error",
});
publicInterface.stop();
return;
}
peer.on("connection", handle_new_viewer);
signalFns.signal_stream_open(publicInterface.role, id);
});
},
// End the serving.
stop: function()
{
peer.destroy();
},
get id()
{
return (peer? peer.id : undefined);
},
};
return publicInterface;
// Gets called when a new viewer connects to this server.
function handle_new_viewer(newViewer)
{
// Wait until the connection is fully open, then send the new viewer a copy
// of the current project's full data.
let startTime = Date.now();
const connectionWaitTimeoutMs = 10000;
const dataReceptionWaitTimeoutMs = 30000;
const timeBetweenAttemptsMs = 500;
const timer = setInterval(()=>
{
// If the stream has been closed.
if (!peer)
{
clearInterval(timer);
return;
}
if (newViewer.open)
{
clearInterval(timer);
Rsed.stream.send_packet("project-data",
Rsed.core.current_project().json(),
newViewer,
{
keepAlive: false,
});
numViewersServed++;
// Give the viewer a bit of time to receive the data, then, if they
// haven't yet done so themselves, close their connection to us.
/// TODO: Should we instead have bidirectional streaming, i.e. the
/// viewer sending the server confirmation when they've received
/// the data? Maybe.
setTimeout(()=>
{
if (newViewer &&
newViewer.open)
{
newViewer.close();
}
}, dataReceptionWaitTimeoutMs);
}
else if ((Date.now() - startTime) > connectionWaitTimeoutMs)
{
newViewer.close();
clearInterval(timer);
}
}, timeBetweenAttemptsMs);
return;
}
};
/*
* Most recent known filename: js/stream/streamer.js
*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// Streamer is an Rsed.stream() role in a one-to-many network. Clients who are streamers
// accept connections from viewers and send (stream) data to them. Data doesn't flow from
// viewers to streamers, however.
Rsed.stream.streamer = function(streamId, signalFns)
{
const viewers = [];
// Maximum number of simultaneous viewers.
const maxNumViewers = 1000;
// PeerJS's Peer() object.
let peer = null;
const publicInterface = {
role: "streamer",
num_connections: function()
{
// Cull away viewers whose connection is not currently open.
/// TODO: Put this in a separate function, since it's weird that a
/// a call to num_connections() would have this side effect.
const openViewers = viewers.filter(viewer=>
{
if (!viewer.open)
{
viewer.close();
return false;
}
return true;
});
viewers.splice(0, Infinity, ...openViewers);
return viewers.length;
},
// Sends the given data packet to the current viewers.
send: function(packet, dstViewer = null)
{
if (dstViewer)
{
dstViewer.send(packet);
}
else
{
for (const viewer of viewers)
{
viewer.send(packet);
}
}
return;
},
// Streamers don't receive data, they just ignore requests to do so.
receive: function(){},
// Start streaming.
start: function()
{
if (status.active)
{
Rsed.log("Attempted to start a new stream while an existing stream was still active. Ignoring this.");
return;
}
signalFns.signal_stream_status("initializing");
peer = new Peer(streamId, Rsed.stream.peerJsServerConfig);
peer.on("close", ()=>signalFns.signal_stream_closed(streamId));
peer.on("error", (error)=>
{
publicInterface.stop();
signalFns.signal_stream_error(error);
});
peer.on("open", (id)=>
{
if (id != streamId)
{
Rsed.ui.popup_notification("Stream Error: Received an invalid ID from the peer server.", {
notificationType: "error",
});
publicInterface.stop();
return;
}
peer.on("connection", handle_new_viewer);
signalFns.signal_stream_open(publicInterface.role, id);
});
},
// End the stream. All viewers will be kicked off.
stop: function()
{
for (const viewer of viewers)
{
viewer.close();
}
viewers.length = 0;
peer.destroy();
},
get id()
{
return (peer? peer.id : undefined);
},
};
return publicInterface;
// Gets called when a new viewer connects to this stream.
function handle_new_viewer(newViewer)
{
if (viewers.length > maxNumViewers)
{
/// TODO: Send the viewer an error message.
newViewer.close();
return;
}
// Wait until the connection is fully open for streaming, then send
// the new viewer a copy of the current project's full data.
let startTime = Date.now();
const waitTimeoutMs = 5000; // Number of milliseconds to wait, at most.
const timeBetweenAttemptsMs = 500;
const timer = setInterval(()=>
{
// If the stream has been closed.
if (!peer)
{
clearInterval(timer);
return;
}
if (newViewer.open)
{
clearInterval(timer);
Rsed.stream.send_packet("project-data",
Rsed.core.current_project().json(),
newViewer);
viewers.push(newViewer);
}
else if ((Date.now() - startTime) > waitTimeoutMs)
{
newViewer.close();
clearInterval(timer);
}
}, timeBetweenAttemptsMs);
return;
}
};
/*
* Most recent known filename: js/stream/viewer.js
*
* 2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
// Viewer is an Rsed.stream() role in a one-to-many network. Clients who are viewers
// connect to a streamer and receive data from them. Data doesn't flow from viewers
// to streamers, however.
Rsed.stream.viewer = function(streamId, signalFns)
{
// The stream we're viewing.
let srcStream = null;
// PeerJS's Peer() object.
let peer = null;
const publicInterface = {
role: "viewer",
// How many streamers this viewer is connected to.
num_connections: function()
{
return Number(srcStream !== null);
},
// Viewers don't send data, they just ignore requests to do so.
send: function(){},
// Receive and process a packet of data from the streamer.
receive: function(packet)
{
// Ignore malformed packets.
if (!Rsed.stream.is_validly_formed_packet(packet))
{
return;
}
if (!packet.header.keepAlive)
{
publicInterface.stop();
}
switch (packet.header.what)
{
case "request-to-disconnect":
{
publicInterface.stop();
break;
}
// A streamer client has edited a track asset and wants us to replicate
// those edits on our client. Expects packet.data to contain the data
// for a call to Rsed.ui.assetMutator.user_edit().
case "user-edit":
{
Rsed.ui.assetMutator.user_edit(packet.data.assetType, packet.data.editAction);
break;
}
// Expects packet.data to be a string containing the stream project's data
// in RallySportED-js's JSON format.
case "project-data":
{
try
{
const projectData = JSON.parse(packet.data);
Rsed.core.start({
stream: packet.header.creatorId,
project: {
dataLocality: "inline",
data: projectData,
},
});
}
catch (error)
{
Rsed.throw(`Failed to sync with the stream: ${error}`);
}
break;
}
// We'll fully ignore any unknown packets.
default: break;
}
return;
},
// Connects this viewer to a stream.
start: function()
{
if (srcStream)
{
Rsed.log("Attempted to start viewing a stream while already viewing another stream.");
publicInterface.stop();
}
signalFns.signal_stream_status("initializing");
peer = new Peer(Rsed.stream.generate_random_stream_id(), Rsed.stream.peerJsServerConfig);
peer.on("error", (error)=>
{
publicInterface.stop();
signalFns.signal_stream_error(error);
Rsed.throw(`Stream ${error}`);
});
peer.on("close", ()=>
{
signalFns.signal_stream_closed(streamId);
});
peer.on("open", ()=>
{
// Attempt to connect to the given stream.
srcStream = peer.connect(streamId, {reliable: true});
srcStream.on("close", publicInterface.stop);
srcStream.on("data", publicInterface.receive);
srcStream.on("error", (error)=>
{
publicInterface.stop();
signalFns.signal_stream_error(error);
Rsed.throw(`Stream ${error}`);
});
srcStream.on("open", ()=>
{
signalFns.signal_stream_open(publicInterface.role, streamId);
});
});
},
stop: function()
{
if (!srcStream)
{
Rsed.log("Attempted to close a connection to a stream that we weren't connected to. Ignoring this.");
return;
}
srcStream.close();
srcStream = null;
peer.destroy();
},
get id()
{
return (peer? peer.id : undefined);
},
};
return publicInterface;
};
/*
* Most recent known filename: js/core/core.js
*
* 2018-2020 Tarpeeksi Hyvae Soft
*
* Software: RallySportED-js
*
*/
"use strict";
Rsed.core = (function()
{
// Set to true while the core is running (e.g. as a result of calling start()).
let coreIsRunning = false;
// Set to true when core.panic() is called.
let corePanicked = false;
// The number of frames per second being generated.
let programFPS = 0;
// The project we've currently got loaded. When the user makes edits or requests a save,
// this is the target project.
let project = Rsed.project.placeholder;
// The scene we're currently displaying to the user.
let currentScene = Rsed.scenes["3d"];
// The number of milliseconds elapsed between the most recent tick and the one
// preceding it. E.g. at 60 FPS this would be about 16.
let tickTimeDeltaMs = 0;
// Whether to display an FPS counter to the user.
const fpsCounterEnabled = (()=>
{
const params = new URLSearchParams(window.location.search);
return (params.has("showFramerate") && (Number(params.get("showFramerate")) === 1));
})();
const publicInterface =
{
appName: "RallySportED",
tick_time_delta_ms: ()=>tickTimeDeltaMs,
is_running: ()=>coreIsRunning,
renderer_fps: ()=>programFPS,
fps_counter_enabled: ()=>fpsCounterEnabled,
default_startup_args: function()
{
return {
project:
{
// Whether the project's data files will be loaded from RallySportED-js's server
// ("server-rsed"), from Rally-Sport Content's server ("server-rsc"), or provided
// by the client (e.g. via file drag onto the browser).
dataLocality: "server-rsed", // | "server-rsc" | "client"
// An identifier for this project's data. For server-side projects, this will be
// e.g. a Rally-Sport Content track resource ID, and for client-side data a file
// reference.
contentId: "demod",
},
// If the user is viewing a stream, its id will be set here.
stream: null,
// Whether to run the DOSBox player immediately on load.
playOnStartup: false,
}
},
// Starts up RallySportED with the given project to edit.
start: async function(args = {})
{
Rsed.throw_if_not_type("object", args);
args = {
...this.default_startup_args(),
...args,
};
coreIsRunning = false;
// Hide the UI while we load up the project's data etc.
Rsed.ui.htmlUI.set_visible(false);
verify_browser_compatibility();
await load_project(args.project);
Rsed.ui.htmlUI.refresh();
Rsed.ui.htmlUI.set_visible(true);
if (args.playOnStartup)
{
Rsed.player.play(true);
}
coreIsRunning = true;
},
// Something went fatally wrong and the app can't recover from it. All that's
// left to do is to shut everything down and ask the user to reload.
panic: function(errorMessage)
{
Rsed.ui.htmlUI.display_blue_screen(errorMessage);
coreIsRunning = false;
corePanicked = true;
publicInterface.start = ()=>{}; // Prevent restarting from code.
},
current_project: function()
{
Rsed.assert && (project !== null)
|| Rsed.throw("Attempting to access an uninitialized project.");
return project;
},
current_scene: function()
{
Rsed.assert && (currentScene !== null)
|| Rsed.throw("Attempting to access an uninitialized scene.");
return currentScene;
},
set_scene: function(sceneName)
{
Rsed.assert && (Rsed.scenes[sceneName])
|| Rsed.throw("Attempting to set an unknown scene.");
currentScene = Rsed.scenes[sceneName];
// If we've switched to the tilemap scene, make sure it's reflecting
// any changes we may have made to the track's tilemap in other scenes.
if (currentScene == Rsed.scenes["tilemap"])
{
currentScene.refresh_tilemap_view();
}
return;
},
}
tick();
render_loading_animation();
return publicInterface;
// Renders a spinner until the core starts up.
function render_loading_animation()
{
const targetScale = 2000;
let currentScale = 25;
(function render_loop(frameCount = 170)
{
if (coreIsRunning ||
corePanicked)
{
return;
}
if (frameCount >= 180)
{
const shade = 168;
currentScale = Rsed.lerp(currentScale, targetScale, 0.0001);
const meshes = new Array(100).fill().map((p, idx)=>
{
const point = Rngon.ngon([Rngon.vertex((idx / 5000), 0, 0)],
{
color: Rngon.color_rgba(shade, shade, shade),
});
const mesh = Rngon.mesh([point],
{
rotation: Rngon.rotation_vector(70, 0, ((500 + frameCount * idx) / 30)),
scaling: Rngon.scaling_vector(currentScale, currentScale, currentScale)
});
return mesh;
});
Rngon.render(Rsed.visual.canvas.domElement.getAttribute("id"), meshes,
{
cameraPosition: Rngon.translation_vector(0, 0, -14),
scale: 0.25,
});
}
window.requestAnimationFrame(()=>render_loop(frameCount + 1));
})();
}
// Called once per frame to orchestrate program flow.
function tick(timestamp = 0, timeDeltaMs = 0)
{
if (coreIsRunning &&
!Rsed.player.is_playing())
{
tickTimeDeltaMs = timeDeltaMs;
programFPS = Math.round(1000 / (timeDeltaMs || 1));
currentScene.handle_user_interaction();
currentScene.draw_mesh();
currentScene.draw_ui();
}
// Keep ticking.
window.requestAnimationFrame((newTimestamp)=>tick(newTimestamp, (newTimestamp - timestamp)));
}
// Test various browser compatibility factors, and give the user messages of warning where appropriate.
function verify_browser_compatibility()
{
// RallySportED-js projects are exported (saved) via JSZip using Blobs.
if (!JSZip.support.blob)
{
Rsed.ui.popup_notification("This browser doesn't support saving projects to disk!",
{
notificationType: "warning",
});
}
// A crude test for whether the user's device might not have the required input
// devices available.
if (Rsed.browserMetadata.isMobile)
{
Rsed.ui.popup_notification("Note: This app has limited support for mobile devices.",
{
timeoutMs: 7000,
});
}
}
async function load_project(projectMeta)
{
project = Rsed.project.placeholder;
/// TODO: Disable undo/redo while the project loads.
Rsed.world.camera.reset_camera_position();
project = await Rsed.project(projectMeta);
Rsed.ui.undoStack.reset();
}
})();
