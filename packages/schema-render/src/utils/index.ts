import { isWeb, isWeChatMiniProgram, isMiniApp, isByteDanceMicroApp } from '@uni/env';
import storage from '@uni/storage';
import { getCurrentPages } from '@uni/application';

export const get = (object: any, path: string | string[], def?: any) => {
  const _path = Array.isArray(path) ? path : path.split('.');
  return (
    _path.reduce((obj, p) => {
      return obj && obj[p];
    }, object) ?? undefined
  );
};
export const getAssociationValue = () => {
  const pageInfo = getCurrentPages();
  const key = `_agro_form_${pageInfo[pageInfo.length - 1].pageId}`;
  const data = storage.getStorageSync({ key }).data;
  return data;
};
export const setAssociationValue = (data) => {
  const pageInfo = getCurrentPages();
  const key = `_agro_form_${pageInfo[pageInfo.length - 1].pageId}`;
  storage.setStorage({ key, data });
};
export const pageScrollTo = (options) => {
  if (isWeb) {
    const selector = document.querySelector(options.selector);
    if (selector) {
      window.scrollTo(0, selector.offsetTop);
    }
  } else if (isMiniApp) {
    my.pageScrollTo(options);
  } else if (isWeChatMiniProgram) {
    wx.pageScrollTo(options);
  } else if (isByteDanceMicroApp) {
    // eslint-disable-next-line react-directives/no-undef
    tt.pageScrollTo(options);
  }
};
export const set = (object: any, path: string | string[], val: any) => {
  const _path = Array.isArray(path) ? path : path.split('.');
  _path.slice(0, -1).reduce((obj, p) => {
    // eslint-disable-next-line no-param-reassign
    if (!obj[p] && typeof Number(p) === 'number') {
      // eslint-disable-next-line no-param-reassign
      obj[p] = [];
    } else {
      // eslint-disable-next-line no-param-reassign
      obj[p] = obj[p] || {};
    }
    return obj[p];
  }, object)[_path.pop()] = val;
  return object;
};
export const throttle = (fn, gapTime) => {
  let _lastTime = null;

  return function (args) {
    const _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn(args);
      _lastTime = _nowTime;
    }
  };
};
export function fomatFloat({ src, pos = 2, round = false, maxLength = 0 }) {
  // src是要保留小数的值，pos是要保留几位小数；
  const f = String(src).replace('-', '');
  if (isNaN(Number(f))) {
    return '';
  }
  const initRes = f.split('.')[0];
  if (!f.split('.')[1]) {
    return maxLength ? f.replace('-', '').substring(0, maxLength + 1) : f.replace('-', '');
  }
  if (!f.split('.')[1] || f.split('.')[1].length <= pos) {
    return maxLength ? src.replace('-', '').substring(0, maxLength + 1) : src.replace('-', '');
  }
  let floatRes: any = (f.split('.')[1] || '').substring(0, pos);
  if (round) {
    const r = (f.split('.')[1] || '').substring(pos, pos + 1);
    if (r && Number(r) >= 5) {
      floatRes = parseInt(floatRes, 10) + 1;
    }
  }

  const res = initRes + (floatRes ? '.' + floatRes : '');

  // console.log(maxLength ? res.substring(0, maxLength + 1) : res);
  return maxLength ? Number(res.substring(0, maxLength + 1)) : Number(res);
}

// 校验是否为空，包括空数组，空对象的校验
export const isNone = (target: any) => {
  if (Array.isArray(target)) {
    return target.length === 0;
  } else if (Object.prototype.toString.call(target) === '[object Object]') {
    return Object.keys(target).length === 0;
  } else {
    return (
      Object.prototype.toString.call(target) === '[object Null]' ||
      typeof target === 'undefined' ||
      (!target && target !== 0)
    );
  }
};
