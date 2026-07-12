const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const previewImage = document.getElementById('previewImage');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const fileNameEl = document.getElementById('fileName');
const statusCard = document.getElementById('statusCard');
const cameraInfo = document.getElementById('cameraInfo');
const exposureInfo = document.getElementById('exposureInfo');
const recipeInfo = document.getElementById('recipeInfo');
const extraInfo = document.getElementById('extraInfo');
const sampleBtn = document.getElementById('sampleBtn');
const helpDialog = document.getElementById('helpDialog');
const closeDialogBtn = document.getElementById('closeDialogBtn');

const TIFF_TYPES = {1:1,2:1,3:2,4:4,5:8,7:1,9:4,10:8};

const TAGS = {
  IFD0: {
    0x010F: 'Make', 0x0110: 'Model', 0x0131: 'Software', 0x0132: 'ModifyDate',
    0x8769: 'ExifOffset', 0x8825: 'GPSOffset'
  },
  EXIF: {
    0x829A: 'ExposureTime', 0x829D: 'FNumber', 0x8827: 'ISO', 0x9003: 'DateTimeOriginal',
    0x9204: 'ExposureBias', 0x920A: 'FocalLength', 0x927C: 'MakerNote',
    0xA002: 'PixelXDimension', 0xA003: 'PixelYDimension', 0xA405: 'FocalLengthIn35mmFilm',
    0xA434: 'LensModel'
  }
};

const FUJI_TAGS = {
  0x1001: 'Sharpness',
  0x1002: 'WhiteBalance',
  0x1003: 'Color',
  0x1005: 'ColorTemperature',
  0x100A: 'WhiteBalanceFineTune',
  0x100E: 'NoiseReduction',
  0x100F: 'Clarity',
  0x1010: 'FujiFlashMode',
  0x1040: 'ShadowTone',
  0x1041: 'HighlightTone',
  0x1047: 'GrainEffectRoughness',
  0x1048: 'ColorChromeEffect',
  0x1049: 'BWAdjustment',
  0x104B: 'BWMagentaGreen',
  0x104C: 'GrainEffectSize',
  0x104E: 'ColorChromeFXBlue',
  0x1050: 'ShutterType',
  0x1400: 'DynamicRange',
  0x1401: 'FilmMode',
  0x1402: 'DynamicRangeSetting',
  0x1403: 'DevelopmentDynamicRange',
  0x140B: 'AutoDynamicRange',
  0x1436: 'ImageGeneration',
  0x1443: 'DRangePriority',
  0x1444: 'DRangePriorityAuto',
  0x1445: 'DRangePriorityFixed',
  0x1447: 'FujiModel',
  0x1448: 'FujiModel2'
};

const MAPS = {
  filmMode: {
    // Display names normalized to current Fujifilm Film Simulation menu names.
    0x000: 'PROVIA / STANDARD',
    0x100: 'PROVIA / STANDARD',
    0x110: 'PROVIA / STANDARD',
    0x120: 'ASTIA / SOFT',
    0x130: 'ASTIA / SOFT',
    0x200: 'Velvia / VIVID',
    0x300: 'ASTIA / SOFT',
    0x400: 'Velvia / VIVID',
    0x500: 'PRO Neg. Std',
    0x501: 'PRO Neg. Hi',
    0x600: 'CLASSIC CHROME',
    0x700: 'ETERNA / Cinema',
    0x800: 'CLASSIC Neg.',
    0x900: 'ETERNA BLEACH BYPASS',
    0xA00: 'NOSTALGIC Neg.',
    0xB00: 'REALA ACE'
  },
  bwFilmSimulation: {
    0x300: 'MONOCHROME',
    0x301: 'MONOCHROME + R FILTER',
    0x302: 'MONOCHROME + Ye FILTER',
    0x303: 'MONOCHROME + G FILTER',
    0x310: 'SEPIA',
    0x500: 'ACROS',
    0x501: 'ACROS + R FILTER',
    0x502: 'ACROS + Ye FILTER',
    0x503: 'ACROS + G FILTER'
  },
  whiteBalance: {
    0x0:'Auto',0x1:'Auto (White Priority)',0x2:'Auto (Ambiance Priority)',0x100:'Daylight',0x200:'Cloudy',
    0x300:'Fluorescent 1 / Daylight',0x301:'Fluorescent 2 / Day White',0x302:'Fluorescent 3 / White',
    0x303:'Warm White Fluorescent',0x304:'Living Room Warm White Fluorescent',0x400:'Incandescent',
    0x500:'Flash',0x600:'Underwater',0xF00:'Custom',0xF01:'Custom 2',0xF02:'Custom 3',
    0xF03:'Custom 4',0xF04:'Custom 5',0xFF0:'Kelvin'
  },
  color: {
    0x0:'0',0x80:'+1',0x100:'+2',0xC0:'+3',0xE0:'+4',0x180:'-1',0x200:'-2',0x4C0:'-3',0x4E0:'-4',
    0x300:'Monochrome',0x301:'Monochrome + R Filter',0x302:'Monochrome + Ye Filter',0x303:'Monochrome + G Filter',
    0x310:'Sepia',0x500:'Acros',0x501:'Acros + R Filter',0x502:'Acros + Ye Filter',0x503:'Acros + G Filter'
  },
  sharpness: {0x0:'-4',0x1:'-3',0x2:'-2',0x82:'-1',0x3:'0',0x84:'+1',0x4:'+2',0x5:'+3',0x6:'+4'},
  noiseReduction: {0x0:'0',0x100:'+2',0x180:'+1',0x1C0:'+3',0x1E0:'+4',0x200:'-2',0x280:'-1',0x2C0:'-3',0x2E0:'-4'},
  grainRoughness: {0:'Off',32:'Weak',64:'Strong'},
  grainSize: {0:'Off',16:'Small',32:'Large'},
  colorChrome: {0:'Off',32:'Weak',64:'Strong'},
  shutterType: {0:'Mechanical',1:'Electronic',2:'Electronic (Long Shutter)',3:'Electronic Front Curtain'},
  dynamicRange: {1:'Standard',3:'Wide'},
  dynamicRangeSetting: {0x0:'Auto',0x1:'Manual',0x100:'DR100',0x200:'DR200 / Wide1 (230%)',0x201:'DR400 / Wide2 (400%)'},
  developmentDynamicRange: {100:'DR100',200:'DR200',230:'DR200 / Wide1 (230%)',400:'DR400'},
  imageGeneration: {0:'Original Image',1:'Re-developed from RAW'},
  dRangePriority: {0:'Auto',1:'Fixed'},
  dRangePriorityAuto: {1:'Weak',2:'Strong',3:'Plus'},
  dRangePriorityFixed: {1:'Weak',2:'Strong'}
};

function setStatus(type, title, text) {
  statusCard.className = `status-card ${type}`;
  statusCard.innerHTML = `<div class="status-title">${title}</div><div class="status-text">${text}</div>`;
}

function makeKVGrid(el, items) {
  el.innerHTML = '';
  if (!items.length) {
    el.innerHTML = '<div class="kv-item"><div class="kv-label">안내</div><div class="kv-value kv-empty">표시할 정보가 없습니다.</div></div>';
    return;
  }
  for (const item of items) {
    const div = document.createElement('div');
    div.className = 'kv-item';
    div.innerHTML = `<div class="kv-label">${item.label}</div><div class="kv-value ${item.value ? '' : 'kv-empty'}">${item.value || '—'}</div>`;
    el.appendChild(div);
  }
}

function formatExposureTime(v) {
  if (typeof v === 'number') {
    if (v >= 1) return `${trimZero(v.toFixed(1))} sec`;
    return `1/${Math.round(1/v)}`;
  }
  return v;
}
function formatFNumber(v){ return typeof v === 'number' ? `f/${trimZero(v.toFixed(1))}` : v; }
function formatFocal(v){ return typeof v === 'number' ? `${trimZero(v.toFixed(1))}mm` : v; }
function formatBias(v){ return typeof v === 'number' ? `${v>0?'+':''}${trimZero(v.toFixed(2))} EV` : v; }
function trimZero(str){ return String(str).replace(/\.0+$/,'').replace(/(\.\d*[1-9])0+$/,'$1'); }

function isJpeg(file) {
  return /image\/jpeg/.test(file.type) || /\.(jpe?g)$/i.test(file.name);
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) handleFile(file);
});

dropZone.addEventListener('dragover', (e)=>{ e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', ()=> dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e)=>{
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files?.[0];
  if (file) handleFile(file);
});

sampleBtn.addEventListener('click', ()=> helpDialog.showModal());
closeDialogBtn.addEventListener('click', ()=> helpDialog.close());
helpDialog.addEventListener('click', (e)=>{ if (e.target === helpDialog) helpDialog.close(); });

async function handleFile(file) {
  if (!isJpeg(file)) {
    setStatus('error', '지원되지 않는 파일', 'JPEG(.jpg / .jpeg) 파일만 분석할 수 있습니다.');
    return;
  }

  fileNameEl.textContent = file.name;
  previewImage.src = URL.createObjectURL(file);
  previewImage.hidden = false;
  previewPlaceholder.hidden = true;

  try {
    setStatus('idle', '분석 중', '메타데이터를 읽는 중입니다...');
    const buffer = await file.arrayBuffer();
    const parsed = parseJpegExif(buffer);
    renderResult(parsed, file);
  } catch (error) {
    console.error(error);
    makeKVGrid(cameraInfo, []); makeKVGrid(exposureInfo, []); makeKVGrid(recipeInfo, []); makeKVGrid(extraInfo, []);
    setStatus('error', '분석 실패', '메타데이터를 해석하지 못했습니다. 원본 Fujifilm JPEG인지 확인해 주세요.');
  }
}

function parseJpegExif(buffer) {
  const view = new DataView(buffer);
  if (view.getUint16(0) !== 0xFFD8) throw new Error('Not JPEG');
  const exifMeta = findExifSegment(view);
  if (!exifMeta) throw new Error('No EXIF');
  const { tiffOffset } = exifMeta;
  const little = getEndian(view, tiffOffset);
  const ifd0Offset = view.getUint32(tiffOffset + 4, little);
  const ifd0 = parseIFD(view, tiffOffset + ifd0Offset, little, tiffOffset, TAGS.IFD0);
  const exifSub = ifd0.ExifOffset != null ? parseIFD(view, tiffOffset + ifd0.ExifOffset, little, tiffOffset, TAGS.EXIF) : {};

  let maker = null;
  if (typeof exifSub.MakerNote === 'object' && exifSub.MakerNote.absoluteOffset != null) {
    maker = parseFujiMakerNote(view, exifSub.MakerNote.absoluteOffset);
  }

  return { ifd0, exif: exifSub, maker };
}

function findExifSegment(view) {
  let offset = 2;
  while (offset < view.byteLength) {
    if (view.getUint8(offset) !== 0xFF) break;
    const marker = view.getUint8(offset + 1);
    if (marker === 0xDA || marker === 0xD9) break;
    const size = view.getUint16(offset + 2, false);
    if (marker === 0xE1 && readAscii(view, offset + 4, 6) === 'Exif\x00\x00') {
      return { tiffOffset: offset + 10 };
    }
    offset += 2 + size;
  }
  return null;
}

function getEndian(view, offset) {
  const mark = readAscii(view, offset, 2);
  if (mark === 'II') return true;
  if (mark === 'MM') return false;
  throw new Error('Invalid TIFF endian');
}

function parseIFD(view, dirOffset, little, baseOffset, tagNames = {}) {
  const result = {};
  const count = view.getUint16(dirOffset, little);
  for (let i = 0; i < count; i++) {
    const entry = dirOffset + 2 + i * 12;
    const tag = view.getUint16(entry, little);
    const type = view.getUint16(entry + 2, little);
    const itemCount = view.getUint32(entry + 4, little);
    const totalSize = (TIFF_TYPES[type] || 0) * itemCount;
    let dataOffset = entry + 8;
    let absoluteOffset = null;
    if (totalSize > 4) {
      const rel = view.getUint32(entry + 8, little);
      dataOffset = baseOffset + rel;
      absoluteOffset = dataOffset;
    }
    const value = readValue(view, dataOffset, type, itemCount, little);
    const name = tagNames[tag] || `Tag 0x${tag.toString(16).padStart(4,'0')}`;
    if (tag === 0x927C) {
      result[name] = { raw: value, absoluteOffset: totalSize > 4 ? absoluteOffset : entry + 8 };
    } else {
      result[name] = value;
    }
  }
  return result;
}

function readValue(view, offset, type, count, little) {
  switch (type) {
    case 1: return count === 1 ? view.getUint8(offset) : Array.from({length: count}, (_,i)=>view.getUint8(offset+i));
    case 2: return readAscii(view, offset, count).replace(/\x00+$/,'');
    case 3: return count === 1 ? view.getUint16(offset, little) : Array.from({length: count}, (_,i)=>view.getUint16(offset+i*2, little));
    case 4: return count === 1 ? view.getUint32(offset, little) : Array.from({length: count}, (_,i)=>view.getUint32(offset+i*4, little));
    case 5: return count === 1 ? readRational(view, offset, little, false) : Array.from({length: count}, (_,i)=>readRational(view, offset+i*8, little, false));
    case 7: return { bytes: Array.from({length: count}, (_,i)=>view.getUint8(offset+i)) };
    case 9: return count === 1 ? view.getInt32(offset, little) : Array.from({length: count}, (_,i)=>view.getInt32(offset+i*4, little));
    case 10: return count === 1 ? readRational(view, offset, little, true) : Array.from({length: count}, (_,i)=>readRational(view, offset+i*8, little, true));
    default: return null;
  }
}

function readRational(view, offset, little, signed) {
  const num = signed ? view.getInt32(offset, little) : view.getUint32(offset, little);
  const den = signed ? view.getInt32(offset+4, little) : view.getUint32(offset+4, little);
  if (!den) return 0;
  return num / den;
}

function readAscii(view, offset, count) {
  let out = '';
  for (let i = 0; i < count; i++) out += String.fromCharCode(view.getUint8(offset + i));
  return out;
}

function parseFujiMakerNote(view, makerOffset) {
  const header = readAscii(view, makerOffset, 8);
  if (!header.startsWith('FUJIFILM')) return null;
  const little = true;
  const ifdRel = view.getUint32(makerOffset + 8, true);
  const dirOffset = makerOffset + ifdRel;
  const raw = parseIFD(view, dirOffset, little, makerOffset, FUJI_TAGS);
  return raw;
}

function renderResult(parsed, file) {
  const make = parsed.ifd0.Make || '';
  const isFuji = /FUJIFILM/i.test(make);
  const makerAvailable = !!parsed.maker;

  const generalCamera = [
    { label:'브랜드', value: parsed.ifd0.Make || '—' },
    { label:'카메라', value: parsed.ifd0.Model || '—' },
    { label:'렌즈', value: parsed.exif.LensModel || '—' },
    { label:'촬영일시', value: parsed.exif.DateTimeOriginal || parsed.ifd0.ModifyDate || '—' },
    { label:'이미지 크기', value: formatDimensions(parsed.exif.PixelXDimension, parsed.exif.PixelYDimension) },
    { label:'소프트웨어', value: parsed.ifd0.Software || '—' }
  ];

  const exposure = [
    { label:'셔터속도', value: parsed.exif.ExposureTime != null ? formatExposureTime(parsed.exif.ExposureTime) : '—' },
    { label:'조리개', value: parsed.exif.FNumber != null ? formatFNumber(parsed.exif.FNumber) : '—' },
    { label:'ISO', value: parsed.exif.ISO != null ? String(parsed.exif.ISO) : '—' },
    { label:'노출 보정', value: parsed.exif.ExposureBias != null ? formatBias(parsed.exif.ExposureBias) : '—' },
    { label:'초점거리', value: parsed.exif.FocalLength != null ? formatFocal(parsed.exif.FocalLength) : '—' },
    { label:'35mm 환산', value: parsed.exif.FocalLengthIn35mmFilm != null ? `${parsed.exif.FocalLengthIn35mmFilm}mm` : '—' }
  ];

  makeKVGrid(cameraInfo, generalCamera);
  makeKVGrid(exposureInfo, exposure);

  const recipeItems = makerAvailable ? buildRecipeItems(parsed.maker) : [];
  makeKVGrid(recipeInfo, recipeItems);

  const extraItems = buildExtraItems(parsed.maker, file);
  makeKVGrid(extraInfo, extraItems);

  if (!isFuji) {
    setStatus('warn', 'FUJIFILM 파일이 아닐 수 있음', '브랜드 정보가 FUJIFILM으로 확인되지 않았습니다. 일반 EXIF만 일부 표시됩니다.');
  } else if (!makerAvailable) {
    setStatus('warn', '부분 분석', '후지 기본 EXIF는 읽었지만 MakerNote 레시피 값은 찾지 못했습니다. 편집된 JPEG일 수 있습니다.');
  } else {
    const gen = parsed.maker.ImageGeneration;
    const genText = gen != null ? decodeMap(gen, MAPS.imageGeneration) : null;
    if (gen === 1) {
      setStatus('warn', '분석 완료 (재현상 이미지)', `후지 MakerNote를 읽었습니다. 단, 이 파일은 "${genText}"로 기록되어 있습니다.`);
    } else {
      setStatus('success', '분석 완료', '후지 원본 JPEG로 보이며 MakerNote 레시피 정보를 읽었습니다.');
    }
  }
}

function buildRecipeItems(m) {
  const wb = decodeWhiteBalance(m.WhiteBalance, m.ColorTemperature);
  const wbShift = decodeWBFineTune(m.WhiteBalanceFineTune);
  const grain = decodeGrain(m.GrainEffectRoughness, m.GrainEffectSize);
  const toneCurve = decodeToneCurve(m.HighlightTone, m.ShadowTone);
  const mono = decodeMonochromeColor(m.BWAdjustment, m.BWMagentaGreen);
  const dr = decodeDynamicRangeDetailed(m);

  return [
    { label:'필름 시뮬레이션', value: decodeFilmSimulation(m) },
    { label:'화이트 밸런스', value: wb },
    { label:'WB 시프트', value: wbShift },
    { label:'DR 설정 방식', value: dr.mode },
    { label:'적용 DR 값', value: dr.applied },
    { label:'톤 곡선', value: toneCurve },
    { label:'컬러 / 모노크롬', value: decodeMap(m.Color, MAPS.color) },
    { label:'모노크롬 색상', value: mono },
    { label:'그레인 효과', value: grain },
    { label:'컬러크롬 효과', value: decodeMap(m.ColorChromeEffect, MAPS.colorChrome) },
    { label:'컬러크롬 FX 블루', value: decodeMap(m.ColorChromeFXBlue, MAPS.colorChrome) },
    { label:'샤프니스', value: decodeMap(m.Sharpness, MAPS.sharpness) },
    { label:'고감도 노이즈 감소', value: decodeMap(m.NoiseReduction, MAPS.noiseReduction) },
    { label:'명료도', value: decodeClarity(m.Clarity) },
    { label:'셔터 타입', value: decodeMap(m.ShutterType, MAPS.shutterType) }
  ];
}

function buildExtraItems(maker, file) {
  const arr = [
    { label:'파일명', value: file?.name || '—' },
    { label:'파일 크기', value: file ? formatFileSize(file.size) : '—' }
  ];
  if (maker) {
    arr.push(
      { label:'이미지 생성', value: decodeMap(maker.ImageGeneration, MAPS.imageGeneration) },
      { label:'Fuji Model', value: maker.FujiModel || maker.FujiModel2 || '—' },
      { label:'DR Priority', value: decodeDynamicRangePriority(maker.DRangePriority, maker.DRangePriorityAuto, maker.DRangePriorityFixed) },
      { label:'DR Raw', value: formatDRRaw(maker) },
      { label:'플래시 모드', value: maker.FujiFlashMode != null ? String(maker.FujiFlashMode) : '—' }
    );
  } else {
    arr.push({ label:'MakerNote 상태', value:'레시피 데이터 없음 또는 해석 불가' });
  }
  return arr;
}

function formatDimensions(w,h){ return w && h ? `${w} × ${h}` : '—'; }
function formatFileSize(bytes){ if(bytes<1024) return `${bytes} B`; if(bytes<1048576) return `${(bytes/1024).toFixed(1)} KB`; return `${(bytes/1048576).toFixed(2)} MB`; }
function decodeMap(v, map){ return v == null ? '—' : (map[v] ?? String(v)); }
function decodeFilmSimulation(m){
  // Monochrome/ACROS/SEPIA are often encoded through the Color/Saturation tag
  // rather than FilmMode, so check that first.
  if (m && m.Color != null && MAPS.bwFilmSimulation[m.Color]) {
    return MAPS.bwFilmSimulation[m.Color];
  }
  if (m && m.FilmMode != null) {
    return MAPS.filmMode[m.FilmMode] || `Unknown FilmMode (${m.FilmMode})`;
  }
  return '—';
}

function decodeWhiteBalance(mode, kelvin){
  if (mode == null) return '—';
  const base = decodeMap(mode, MAPS.whiteBalance);
  if (mode === 0xFF0 && kelvin) return `${base} (${kelvin}K)`;
  return base;
}
function decodeWBFineTune(values){
  if (!Array.isArray(values) || values.length < 2) return '—';
  const conv = values.map(v => {
    if (Math.abs(v) > 9) return v / 20;
    return v;
  });
  return `R ${signedNum(conv[0])} / B ${signedNum(conv[1])}`;
}
function signedNum(v){ return `${v>0?'+':''}${trimZero(Number(v).toFixed(2))}`; }
function decodeGrain(roughness, size){
  const r = decodeMap(roughness, MAPS.grainRoughness);
  const s = decodeMap(size, MAPS.grainSize);
  if (r === '—' && s === '—') return '—';
  if (r === 'Off' || s === 'Off') return 'Off';
  return `${r} / ${s}`;
}
function decodeToneCurve(highlight, shadow){
  if (highlight == null && shadow == null) return '—';
  return `H ${decodeTone(highlight)} / S ${decodeTone(shadow)}`;
}
function decodeTone(v){
  if (v == null) return '—';

  // Fujifilm MakerNote tone values are stored as raw internal values.
  // Some files expose raw 24 / -24 values. On tested 5th-gen style JPEGs,
  // dividing by 12 and reversing the sign maps them to the camera display scale.
  const raw12Map = {
    '-48': '+4', '-36': '+3', '-24': '+2', '-12': '+1',
    '0': '0', '12': '-1', '24': '-2', '36': '-3', '48': '-4'
  };
  if (raw12Map[String(v)] != null) return raw12Map[String(v)];

  const raw16Map = {
    '-64': '+4', '-48': '+3', '-32': '+2', '-16': '+1',
    '0': '0', '16': '-1', '32': '-2', '48': '-3', '64': '-4'
  };
  if (raw16Map[String(v)] != null) return raw16Map[String(v)];

  if (Math.abs(v) <= 48 && v % 6 === 0) {
    const display = -v / 12;
    return signedNum(display);
  }

  if (Math.abs(v) % 16 === 0) {
    const display = -v / 16;
    return signedNum(display);
  }

  return `raw ${v}`;
}

function decodeDynamicRangeDetailed(m){
  const mode = decodeMap(m.DynamicRangeSetting, MAPS.dynamicRangeSetting);

  let applied = '—';
  if (m.DevelopmentDynamicRange != null) {
    applied = MAPS.developmentDynamicRange[m.DevelopmentDynamicRange] || `${m.DevelopmentDynamicRange}%`;
  } else if (m.AutoDynamicRange != null) {
    applied = MAPS.developmentDynamicRange[m.AutoDynamicRange] || `${m.AutoDynamicRange}%`;
  } else if (m.DynamicRangeSetting === 0x100) {
    applied = 'DR100';
  } else if (m.DynamicRangeSetting === 0x200) {
    applied = 'DR200';
  } else if (m.DynamicRangeSetting === 0x201) {
    applied = 'DR400';
  } else if (m.DynamicRange != null) {
    applied = decodeMap(m.DynamicRange, MAPS.dynamicRange);
  }

  const priority = decodeDynamicRangePriority(m.DRangePriority, m.DRangePriorityAuto, m.DRangePriorityFixed);
  if (priority !== '—') {
    applied = applied === '—' ? `DR Priority: ${priority}` : `${applied} / DR Priority: ${priority}`;
  }

  return { mode, applied };
}

function decodeDynamicRangePriority(pr, pra, prf){
  if (pr == null) return '—';
  const mode = decodeMap(pr, MAPS.dRangePriority);
  if (pr === 0 && pra != null) return `${mode} (${decodeMap(pra, MAPS.dRangePriorityAuto)})`;
  if (pr === 1 && prf != null) return `${mode} (${decodeMap(prf, MAPS.dRangePriorityFixed)})`;
  return mode;
}

function formatDRRaw(m){
  const parts = [];
  if (m.DynamicRangeSetting != null) parts.push(`Setting:${m.DynamicRangeSetting}`);
  if (m.DevelopmentDynamicRange != null) parts.push(`Development:${m.DevelopmentDynamicRange}`);
  if (m.AutoDynamicRange != null) parts.push(`Auto:${m.AutoDynamicRange}`);
  if (m.DynamicRange != null) parts.push(`Basic:${m.DynamicRange}`);
  return parts.length ? parts.join(' / ') : '—';
}
function decodeMonochromeColor(wc, mg){
  if (wc == null && mg == null) return '—';
  return `WC ${signedNum(wc || 0)} / MG ${signedNum(mg || 0)}`;
}
function decodeClarity(v){
  if (v == null) return '—';
  const converted = Math.abs(v) > 10 ? v / 1000 : v;
  return signedNum(converted).replace('.00','');
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
