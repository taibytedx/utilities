var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};

// node_modules/@protobufjs/aspromise/index.js
var require_aspromise = __commonJS({
  "node_modules/@protobufjs/aspromise/index.js"(exports2, module2) {
    "use strict";
    module2.exports = asPromise;
    function asPromise(fn, ctx) {
      var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
      while (index < arguments.length)
        params[offset++] = arguments[index++];
      return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err) {
          if (pending) {
            pending = false;
            if (err)
              reject(err);
            else {
              var params2 = new Array(arguments.length - 1), offset2 = 0;
              while (offset2 < params2.length)
                params2[offset2++] = arguments[offset2];
              resolve.apply(null, params2);
            }
          }
        };
        try {
          fn.apply(ctx || null, params);
        } catch (err) {
          if (pending) {
            pending = false;
            reject(err);
          }
        }
      });
    }
  }
});

// node_modules/@protobufjs/base64/index.js
var require_base64 = __commonJS({
  "node_modules/@protobufjs/base64/index.js"(exports2) {
    "use strict";
    var base64 = exports2;
    base64.length = function length(string) {
      var p = string.length;
      if (!p)
        return 0;
      var n = 0;
      while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
      return Math.ceil(string.length * 3) / 4 - n;
    };
    var b64 = new Array(64);
    var s64 = new Array(123);
    for (i = 0; i < 64; )
      s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
    var i;
    base64.encode = function encode(buffer, start, end) {
      var parts = null, chunk = [];
      var i2 = 0, j = 0, t;
      while (start < end) {
        var b = buffer[start++];
        switch (j) {
          case 0:
            chunk[i2++] = b64[b >> 2];
            t = (b & 3) << 4;
            j = 1;
            break;
          case 1:
            chunk[i2++] = b64[t | b >> 4];
            t = (b & 15) << 2;
            j = 2;
            break;
          case 2:
            chunk[i2++] = b64[t | b >> 6];
            chunk[i2++] = b64[b & 63];
            j = 0;
            break;
        }
        if (i2 > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i2 = 0;
        }
      }
      if (j) {
        chunk[i2++] = b64[t];
        chunk[i2++] = 61;
        if (j === 1)
          chunk[i2++] = 61;
      }
      if (parts) {
        if (i2)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i2));
    };
    var invalidEncoding = "invalid encoding";
    base64.decode = function decode(string, buffer, offset) {
      var start = offset;
      var j = 0, t;
      for (var i2 = 0; i2 < string.length; ) {
        var c = string.charCodeAt(i2++);
        if (c === 61 && j > 1)
          break;
        if ((c = s64[c]) === void 0)
          throw Error(invalidEncoding);
        switch (j) {
          case 0:
            t = c;
            j = 1;
            break;
          case 1:
            buffer[offset++] = t << 2 | (c & 48) >> 4;
            t = c;
            j = 2;
            break;
          case 2:
            buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
            t = c;
            j = 3;
            break;
          case 3:
            buffer[offset++] = (t & 3) << 6 | c;
            j = 0;
            break;
        }
      }
      if (j === 1)
        throw Error(invalidEncoding);
      return offset - start;
    };
    base64.test = function test(string) {
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
    };
  }
});

// node_modules/@protobufjs/eventemitter/index.js
var require_eventemitter = __commonJS({
  "node_modules/@protobufjs/eventemitter/index.js"(exports2, module2) {
    "use strict";
    module2.exports = EventEmitter;
    function EventEmitter() {
      this._listeners = {};
    }
    EventEmitter.prototype.on = function on(evt, fn, ctx) {
      (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn,
        ctx: ctx || this
      });
      return this;
    };
    EventEmitter.prototype.off = function off(evt, fn) {
      if (evt === void 0)
        this._listeners = {};
      else {
        if (fn === void 0)
          this._listeners[evt] = [];
        else {
          var listeners = this._listeners[evt];
          for (var i = 0; i < listeners.length; )
            if (listeners[i].fn === fn)
              listeners.splice(i, 1);
            else
              ++i;
        }
      }
      return this;
    };
    EventEmitter.prototype.emit = function emit(evt) {
      var listeners = this._listeners[evt];
      if (listeners) {
        var args = [], i = 1;
        for (; i < arguments.length; )
          args.push(arguments[i++]);
        for (i = 0; i < listeners.length; )
          listeners[i].fn.apply(listeners[i++].ctx, args);
      }
      return this;
    };
  }
});

// node_modules/@protobufjs/float/index.js
var require_float = __commonJS({
  "node_modules/@protobufjs/float/index.js"(exports2, module2) {
    "use strict";
    module2.exports = factory(factory);
    function factory(exports3) {
      if (typeof Float32Array !== "undefined") (function() {
        var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
        function writeFloat_f32_cpy(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
        }
        function writeFloat_f32_rev(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[3];
          buf[pos + 1] = f8b[2];
          buf[pos + 2] = f8b[1];
          buf[pos + 3] = f8b[0];
        }
        exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
        function readFloat_f32_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          return f32[0];
        }
        function readFloat_f32_rev(buf, pos) {
          f8b[3] = buf[pos];
          f8b[2] = buf[pos + 1];
          f8b[1] = buf[pos + 2];
          f8b[0] = buf[pos + 3];
          return f32[0];
        }
        exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
      })();
      else (function() {
        function writeFloat_ieee754(writeUint, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0)
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf, pos);
          else if (isNaN(val))
            writeUint(2143289344, buf, pos);
          else if (val > 34028234663852886e22)
            writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
          else if (val < 11754943508222875e-54)
            writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
          else {
            var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
            writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
          }
        }
        exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
        function readFloat_ieee754(readUint, buf, pos) {
          var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
          return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }
        exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
      })();
      if (typeof Float64Array !== "undefined") (function() {
        var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
        function writeDouble_f64_cpy(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
          buf[pos + 4] = f8b[4];
          buf[pos + 5] = f8b[5];
          buf[pos + 6] = f8b[6];
          buf[pos + 7] = f8b[7];
        }
        function writeDouble_f64_rev(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[7];
          buf[pos + 1] = f8b[6];
          buf[pos + 2] = f8b[5];
          buf[pos + 3] = f8b[4];
          buf[pos + 4] = f8b[3];
          buf[pos + 5] = f8b[2];
          buf[pos + 6] = f8b[1];
          buf[pos + 7] = f8b[0];
        }
        exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
        function readDouble_f64_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          f8b[4] = buf[pos + 4];
          f8b[5] = buf[pos + 5];
          f8b[6] = buf[pos + 6];
          f8b[7] = buf[pos + 7];
          return f64[0];
        }
        function readDouble_f64_rev(buf, pos) {
          f8b[7] = buf[pos];
          f8b[6] = buf[pos + 1];
          f8b[5] = buf[pos + 2];
          f8b[4] = buf[pos + 3];
          f8b[3] = buf[pos + 4];
          f8b[2] = buf[pos + 5];
          f8b[1] = buf[pos + 6];
          f8b[0] = buf[pos + 7];
          return f64[0];
        }
        exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
      })();
      else (function() {
        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0) {
            writeUint(0, buf, pos + off0);
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf, pos + off1);
          } else if (isNaN(val)) {
            writeUint(0, buf, pos + off0);
            writeUint(2146959360, buf, pos + off1);
          } else if (val > 17976931348623157e292) {
            writeUint(0, buf, pos + off0);
            writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
          } else {
            var mantissa;
            if (val < 22250738585072014e-324) {
              mantissa = val / 5e-324;
              writeUint(mantissa >>> 0, buf, pos + off0);
              writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
            } else {
              var exponent = Math.floor(Math.log(val) / Math.LN2);
              if (exponent === 1024)
                exponent = 1023;
              mantissa = val * Math.pow(2, -exponent);
              writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
              writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
            }
          }
        }
        exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
          var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
          var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
          return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }
        exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
      })();
      return exports3;
    }
    function writeUintLE(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    function writeUintBE(val, buf, pos) {
      buf[pos] = val >>> 24;
      buf[pos + 1] = val >>> 16 & 255;
      buf[pos + 2] = val >>> 8 & 255;
      buf[pos + 3] = val & 255;
    }
    function readUintLE(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
    }
    function readUintBE(buf, pos) {
      return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
    }
  }
});

// node_modules/@protobufjs/inquire/index.js
var require_inquire = __commonJS({
  "node_modules/@protobufjs/inquire/index.js"(exports, module) {
    "use strict";
    module.exports = inquire;
    function inquire(moduleName) {
      try {
        var mod = eval("quire".replace(/^/, "re"))(moduleName);
        if (mod && (mod.length || Object.keys(mod).length))
          return mod;
      } catch (e) {
      }
      return null;
    }
  }
});

// node_modules/@protobufjs/utf8/index.js
var require_utf8 = __commonJS({
  "node_modules/@protobufjs/utf8/index.js"(exports2) {
    "use strict";
    var utf8 = exports2;
    utf8.length = function utf8_length(string) {
      var len = 0, c = 0;
      for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
          len += 1;
        else if (c < 2048)
          len += 2;
        else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
          ++i;
          len += 4;
        } else
          len += 3;
      }
      return len;
    };
    utf8.read = function utf8_read(buffer, start, end) {
      var len = end - start;
      if (len < 1)
        return "";
      var parts = null, chunk = [], i = 0, t;
      while (start < end) {
        t = buffer[start++];
        if (t < 128)
          chunk[i++] = t;
        else if (t > 191 && t < 224)
          chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
          t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
          chunk[i++] = 55296 + (t >> 10);
          chunk[i++] = 56320 + (t & 1023);
        } else
          chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i = 0;
        }
      }
      if (parts) {
        if (i)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i));
    };
    utf8.write = function utf8_write(string, buffer, offset) {
      var start = offset, c1, c2;
      for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
          buffer[offset++] = c1;
        } else if (c1 < 2048) {
          buffer[offset++] = c1 >> 6 | 192;
          buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
          ++i;
          buffer[offset++] = c1 >> 18 | 240;
          buffer[offset++] = c1 >> 12 & 63 | 128;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        } else {
          buffer[offset++] = c1 >> 12 | 224;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        }
      }
      return offset - start;
    };
  }
});

// node_modules/@protobufjs/pool/index.js
var require_pool = __commonJS({
  "node_modules/@protobufjs/pool/index.js"(exports2, module2) {
    "use strict";
    module2.exports = pool;
    function pool(alloc, slice, size) {
      var SIZE = size || 8192;
      var MAX = SIZE >>> 1;
      var slab = null;
      var offset = SIZE;
      return function pool_alloc(size2) {
        if (size2 < 1 || size2 > MAX)
          return alloc(size2);
        if (offset + size2 > SIZE) {
          slab = alloc(SIZE);
          offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size2);
        if (offset & 7)
          offset = (offset | 7) + 1;
        return buf;
      };
    }
  }
});

// node_modules/protobufjs/src/util/longbits.js
var require_longbits = __commonJS({
  "node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
    "use strict";
    module2.exports = LongBits;
    var util = require_minimal();
    function LongBits(lo, hi) {
      this.lo = lo >>> 0;
      this.hi = hi >>> 0;
    }
    var zero = LongBits.zero = new LongBits(0, 0);
    zero.toNumber = function() {
      return 0;
    };
    zero.zzEncode = zero.zzDecode = function() {
      return this;
    };
    zero.length = function() {
      return 1;
    };
    var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
    LongBits.fromNumber = function fromNumber(value) {
      if (value === 0)
        return zero;
      var sign = value < 0;
      if (sign)
        value = -value;
      var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
      if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
          lo = 0;
          if (++hi > 4294967295)
            hi = 0;
        }
      }
      return new LongBits(lo, hi);
    };
    LongBits.from = function from(value) {
      if (typeof value === "number")
        return LongBits.fromNumber(value);
      if (util.isString(value)) {
        if (util.Long)
          value = util.Long.fromString(value);
        else
          return LongBits.fromNumber(parseInt(value, 10));
      }
      return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
    };
    LongBits.prototype.toNumber = function toNumber(unsigned) {
      if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
        if (!lo)
          hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
      }
      return this.lo + this.hi * 4294967296;
    };
    LongBits.prototype.toLong = function toLong(unsigned) {
      return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
    };
    var charCodeAt = String.prototype.charCodeAt;
    LongBits.fromHash = function fromHash(hash) {
      if (hash === zeroHash)
        return zero;
      return new LongBits(
        (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
        (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
      );
    };
    LongBits.prototype.toHash = function toHash() {
      return String.fromCharCode(
        this.lo & 255,
        this.lo >>> 8 & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24,
        this.hi & 255,
        this.hi >>> 8 & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
      );
    };
    LongBits.prototype.zzEncode = function zzEncode() {
      var mask = this.hi >> 31;
      this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
      this.lo = (this.lo << 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.zzDecode = function zzDecode() {
      var mask = -(this.lo & 1);
      this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
      this.hi = (this.hi >>> 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.length = function length() {
      var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
      return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
    };
  }
});

// node_modules/protobufjs/src/util/minimal.js
var require_minimal = __commonJS({
  "node_modules/protobufjs/src/util/minimal.js"(exports2) {
    "use strict";
    var util = exports2;
    util.asPromise = require_aspromise();
    util.base64 = require_base64();
    util.EventEmitter = require_eventemitter();
    util.float = require_float();
    util.inquire = require_inquire();
    util.utf8 = require_utf8();
    util.pool = require_pool();
    util.LongBits = require_longbits();
    util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
    util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports2;
    util.emptyArray = Object.freeze ? Object.freeze([]) : (
      /* istanbul ignore next */
      []
    );
    util.emptyObject = Object.freeze ? Object.freeze({}) : (
      /* istanbul ignore next */
      {}
    );
    util.isInteger = Number.isInteger || /* istanbul ignore next */
    function isInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
    util.isString = function isString(value) {
      return typeof value === "string" || value instanceof String;
    };
    util.isObject = function isObject(value) {
      return value && typeof value === "object";
    };
    util.isset = /**
     * Checks if a property on a message is considered to be present.
     * @param {Object} obj Plain object or message instance
     * @param {string} prop Property name
     * @returns {boolean} `true` if considered to be present, otherwise `false`
     */
    util.isSet = function isSet(obj, prop) {
      var value = obj[prop];
      if (value != null && obj.hasOwnProperty(prop))
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
      return false;
    };
    util.Buffer = (function() {
      try {
        var Buffer2 = util.inquire("buffer").Buffer;
        return Buffer2.prototype.utf8Write ? Buffer2 : (
          /* istanbul ignore next */
          null
        );
      } catch (e) {
        return null;
      }
    })();
    util._Buffer_from = null;
    util._Buffer_allocUnsafe = null;
    util.newBuffer = function newBuffer(sizeOrArray) {
      return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
    };
    util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    util.Long = /* istanbul ignore next */
    util.global.dcodeIO && /* istanbul ignore next */
    util.global.dcodeIO.Long || /* istanbul ignore next */
    util.global.Long || util.inquire("long");
    util.key2Re = /^true|false|0|1$/;
    util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    util.longToHash = function longToHash(value) {
      return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
    };
    util.longFromHash = function longFromHash(hash, unsigned) {
      var bits = util.LongBits.fromHash(hash);
      if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
      return bits.toNumber(Boolean(unsigned));
    };
    function merge(dst, src, ifNotSet) {
      for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === void 0 || !ifNotSet)
          dst[keys[i]] = src[keys[i]];
      return dst;
    }
    util.merge = merge;
    util.lcFirst = function lcFirst(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    };
    function newError(name) {
      function CustomError(message, properties) {
        if (!(this instanceof CustomError))
          return new CustomError(message, properties);
        Object.defineProperty(this, "message", { get: function() {
          return message;
        } });
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, CustomError);
        else
          Object.defineProperty(this, "stack", { value: new Error().stack || "" });
        if (properties)
          merge(this, properties);
      }
      (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;
      Object.defineProperty(CustomError.prototype, "name", { get: function() {
        return name;
      } });
      CustomError.prototype.toString = function toString() {
        return this.name + ": " + this.message;
      };
      return CustomError;
    }
    util.newError = newError;
    util.ProtocolError = newError("ProtocolError");
    util.oneOfGetter = function getOneOf(fieldNames) {
      var fieldMap = {};
      for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;
      return function() {
        for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
          if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
            return keys[i2];
      };
    };
    util.oneOfSetter = function setOneOf(fieldNames) {
      return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
          if (fieldNames[i] !== name)
            delete this[fieldNames[i]];
      };
    };
    util.toJSONOptions = {
      longs: String,
      enums: String,
      bytes: String,
      json: true
    };
    util._configure = function() {
      var Buffer2 = util.Buffer;
      if (!Buffer2) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
      }
      util._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || /* istanbul ignore next */
      function Buffer_from(value, encoding) {
        return new Buffer2(value, encoding);
      };
      util._Buffer_allocUnsafe = Buffer2.allocUnsafe || /* istanbul ignore next */
      function Buffer_allocUnsafe(size) {
        return new Buffer2(size);
      };
    };
  }
});

// node_modules/protobufjs/src/writer.js
var require_writer = __commonJS({
  "node_modules/protobufjs/src/writer.js"(exports2, module2) {
    "use strict";
    module2.exports = Writer;
    var util = require_minimal();
    var BufferWriter;
    var LongBits = util.LongBits;
    var base64 = util.base64;
    var utf8 = util.utf8;
    function Op(fn, len, val) {
      this.fn = fn;
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    function noop() {
    }
    function State(writer) {
      this.head = writer.head;
      this.tail = writer.tail;
      this.len = writer.len;
      this.next = writer.states;
    }
    function Writer() {
      this.len = 0;
      this.head = new Op(noop, 0, 0);
      this.tail = this.head;
      this.states = null;
    }
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
          return new BufferWriter();
        })();
      } : function create_array() {
        return new Writer();
      };
    };
    Writer.create = create();
    Writer.alloc = function alloc(size) {
      return new util.Array(size);
    };
    if (util.Array !== Array)
      Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
    Writer.prototype._push = function push(fn, len, val) {
      this.tail = this.tail.next = new Op(fn, len, val);
      this.len += len;
      return this;
    };
    function writeByte(val, buf, pos) {
      buf[pos] = val & 255;
    }
    function writeVarint32(val, buf, pos) {
      while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
      }
      buf[pos] = val;
    }
    function VarintOp(len, val) {
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    VarintOp.prototype = Object.create(Op.prototype);
    VarintOp.prototype.fn = writeVarint32;
    Writer.prototype.uint32 = function write_uint32(value) {
      this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
        value
      )).len;
      return this;
    };
    Writer.prototype.int32 = function write_int32(value) {
      return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
    };
    Writer.prototype.sint32 = function write_sint32(value) {
      return this.uint32((value << 1 ^ value >> 31) >>> 0);
    };
    function writeVarint64(val, buf, pos) {
      while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
      }
      while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
      }
      buf[pos++] = val.lo;
    }
    Writer.prototype.uint64 = function write_uint64(value) {
      var bits = LongBits.from(value);
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.int64 = Writer.prototype.uint64;
    Writer.prototype.sint64 = function write_sint64(value) {
      var bits = LongBits.from(value).zzEncode();
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.bool = function write_bool(value) {
      return this._push(writeByte, 1, value ? 1 : 0);
    };
    function writeFixed32(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    Writer.prototype.fixed32 = function write_fixed32(value) {
      return this._push(writeFixed32, 4, value >>> 0);
    };
    Writer.prototype.sfixed32 = Writer.prototype.fixed32;
    Writer.prototype.fixed64 = function write_fixed64(value) {
      var bits = LongBits.from(value);
      return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
    };
    Writer.prototype.sfixed64 = Writer.prototype.fixed64;
    Writer.prototype.float = function write_float(value) {
      return this._push(util.float.writeFloatLE, 4, value);
    };
    Writer.prototype.double = function write_double(value) {
      return this._push(util.float.writeDoubleLE, 8, value);
    };
    var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
      buf.set(val, pos);
    } : function writeBytes_for(val, buf, pos) {
      for (var i = 0; i < val.length; ++i)
        buf[pos + i] = val[i];
    };
    Writer.prototype.bytes = function write_bytes(value) {
      var len = value.length >>> 0;
      if (!len)
        return this._push(writeByte, 1, 0);
      if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
      }
      return this.uint32(len)._push(writeBytes, len, value);
    };
    Writer.prototype.string = function write_string(value) {
      var len = utf8.length(value);
      return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
    };
    Writer.prototype.fork = function fork() {
      this.states = new State(this);
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
      return this;
    };
    Writer.prototype.reset = function reset() {
      if (this.states) {
        this.head = this.states.head;
        this.tail = this.states.tail;
        this.len = this.states.len;
        this.states = this.states.next;
      } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
      }
      return this;
    };
    Writer.prototype.ldelim = function ldelim() {
      var head = this.head, tail = this.tail, len = this.len;
      this.reset().uint32(len);
      if (len) {
        this.tail.next = head.next;
        this.tail = tail;
        this.len += len;
      }
      return this;
    };
    Writer.prototype.finish = function finish() {
      var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
      while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
      }
      return buf;
    };
    Writer._configure = function(BufferWriter_) {
      BufferWriter = BufferWriter_;
      Writer.create = create();
      BufferWriter._configure();
    };
  }
});

// node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = __commonJS({
  "node_modules/protobufjs/src/writer_buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = BufferWriter;
    var Writer = require_writer();
    (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
    var util = require_minimal();
    function BufferWriter() {
      Writer.call(this);
    }
    BufferWriter._configure = function() {
      BufferWriter.alloc = util._Buffer_allocUnsafe;
      BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos);
      } : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy)
          val.copy(buf, pos, 0, val.length);
        else for (var i = 0; i < val.length; )
          buf[pos++] = val[i++];
      };
    };
    BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
      if (util.isString(value))
        value = util._Buffer_from(value, "base64");
      var len = value.length >>> 0;
      this.uint32(len);
      if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
      return this;
    };
    function writeStringBuffer(val, buf, pos) {
      if (val.length < 40)
        util.utf8.write(val, buf, pos);
      else if (buf.utf8Write)
        buf.utf8Write(val, pos);
      else
        buf.write(val, pos);
    }
    BufferWriter.prototype.string = function write_string_buffer(value) {
      var len = util.Buffer.byteLength(value);
      this.uint32(len);
      if (len)
        this._push(writeStringBuffer, len, value);
      return this;
    };
    BufferWriter._configure();
  }
});

// node_modules/protobufjs/src/reader.js
var require_reader = __commonJS({
  "node_modules/protobufjs/src/reader.js"(exports2, module2) {
    "use strict";
    module2.exports = Reader;
    var util = require_minimal();
    var BufferReader;
    var LongBits = util.LongBits;
    var utf8 = util.utf8;
    function indexOutOfRange(reader, writeLength) {
      return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
    }
    function Reader(buffer) {
      this.buf = buffer;
      this.pos = 0;
      this.len = buffer.length;
    }
    var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
      if (buffer instanceof Uint8Array || Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    } : function create_array2(buffer) {
      if (Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    };
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer2) {
          return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
        })(buffer);
      } : create_array;
    };
    Reader.create = create();
    Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */
    util.Array.prototype.slice;
    Reader.prototype.uint32 = /* @__PURE__ */ (function read_uint32_setup() {
      var value = 4294967295;
      return function read_uint32() {
        value = (this.buf[this.pos] & 127) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        if ((this.pos += 5) > this.len) {
          this.pos = this.len;
          throw indexOutOfRange(this, 10);
        }
        return value;
      };
    })();
    Reader.prototype.int32 = function read_int32() {
      return this.uint32() | 0;
    };
    Reader.prototype.sint32 = function read_sint32() {
      var value = this.uint32();
      return value >>> 1 ^ -(value & 1) | 0;
    };
    function readLongVarint() {
      var bits = new LongBits(0, 0);
      var i = 0;
      if (this.len - this.pos > 4) {
        for (; i < 4; ++i) {
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
        i = 0;
      } else {
        for (; i < 3; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
      }
      if (this.len - this.pos > 4) {
        for (; i < 5; ++i) {
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      } else {
        for (; i < 5; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      }
      throw Error("invalid varint encoding");
    }
    Reader.prototype.bool = function read_bool() {
      return this.uint32() !== 0;
    };
    function readFixed32_end(buf, end) {
      return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
    }
    Reader.prototype.fixed32 = function read_fixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4);
    };
    Reader.prototype.sfixed32 = function read_sfixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4) | 0;
    };
    function readFixed64() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);
      return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
    }
    Reader.prototype.float = function read_float() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readFloatLE(this.buf, this.pos);
      this.pos += 4;
      return value;
    };
    Reader.prototype.double = function read_double() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readDoubleLE(this.buf, this.pos);
      this.pos += 8;
      return value;
    };
    Reader.prototype.bytes = function read_bytes() {
      var length = this.uint32(), start = this.pos, end = this.pos + length;
      if (end > this.len)
        throw indexOutOfRange(this, length);
      this.pos += length;
      if (Array.isArray(this.buf))
        return this.buf.slice(start, end);
      return start === end ? new this.buf.constructor(0) : this._slice.call(this.buf, start, end);
    };
    Reader.prototype.string = function read_string() {
      var bytes2 = this.bytes();
      return utf8.read(bytes2, 0, bytes2.length);
    };
    Reader.prototype.skip = function skip(length) {
      if (typeof length === "number") {
        if (this.pos + length > this.len)
          throw indexOutOfRange(this, length);
        this.pos += length;
      } else {
        do {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
      }
      return this;
    };
    Reader.prototype.skipType = function(wireType) {
      switch (wireType) {
        case 0:
          this.skip();
          break;
        case 1:
          this.skip(8);
          break;
        case 2:
          this.skip(this.uint32());
          break;
        case 3:
          while ((wireType = this.uint32() & 7) !== 4) {
            this.skipType(wireType);
          }
          break;
        case 5:
          this.skip(4);
          break;
        /* istanbul ignore next */
        default:
          throw Error("invalid wire type " + wireType + " at offset " + this.pos);
      }
      return this;
    };
    Reader._configure = function(BufferReader_) {
      BufferReader = BufferReader_;
      Reader.create = create();
      BufferReader._configure();
      var fn = util.Long ? "toLong" : (
        /* istanbul ignore next */
        "toNumber"
      );
      util.merge(Reader.prototype, {
        int64: function read_int64() {
          return readLongVarint.call(this)[fn](false);
        },
        uint64: function read_uint64() {
          return readLongVarint.call(this)[fn](true);
        },
        sint64: function read_sint64() {
          return readLongVarint.call(this).zzDecode()[fn](false);
        },
        fixed64: function read_fixed64() {
          return readFixed64.call(this)[fn](true);
        },
        sfixed64: function read_sfixed64() {
          return readFixed64.call(this)[fn](false);
        }
      });
    };
  }
});

// node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = __commonJS({
  "node_modules/protobufjs/src/reader_buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = BufferReader;
    var Reader = require_reader();
    (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
    var util = require_minimal();
    function BufferReader(buffer) {
      Reader.call(this, buffer);
    }
    BufferReader._configure = function() {
      if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
    };
    BufferReader.prototype.string = function read_string_buffer() {
      var len = this.uint32();
      return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
    };
    BufferReader._configure();
  }
});

// node_modules/protobufjs/src/rpc/service.js
var require_service = __commonJS({
  "node_modules/protobufjs/src/rpc/service.js"(exports2, module2) {
    "use strict";
    module2.exports = Service;
    var util = require_minimal();
    (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
    function Service(rpcImpl, requestDelimited, responseDelimited) {
      if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");
      util.EventEmitter.call(this);
      this.rpcImpl = rpcImpl;
      this.requestDelimited = Boolean(requestDelimited);
      this.responseDelimited = Boolean(responseDelimited);
    }
    Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
      if (!request)
        throw TypeError("request must be specified");
      var self2 = this;
      if (!callback)
        return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
      if (!self2.rpcImpl) {
        setTimeout(function() {
          callback(Error("already ended"));
        }, 0);
        return void 0;
      }
      try {
        return self2.rpcImpl(
          method,
          requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
          function rpcCallback(err, response) {
            if (err) {
              self2.emit("error", err, method);
              return callback(err);
            }
            if (response === null) {
              self2.end(
                /* endedByRPC */
                true
              );
              return void 0;
            }
            if (!(response instanceof responseCtor)) {
              try {
                response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
              } catch (err2) {
                self2.emit("error", err2, method);
                return callback(err2);
              }
            }
            self2.emit("data", response, method);
            return callback(null, response);
          }
        );
      } catch (err) {
        self2.emit("error", err, method);
        setTimeout(function() {
          callback(err);
        }, 0);
        return void 0;
      }
    };
    Service.prototype.end = function end(endedByRPC) {
      if (this.rpcImpl) {
        if (!endedByRPC)
          this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
      }
      return this;
    };
  }
});

// node_modules/protobufjs/src/rpc.js
var require_rpc = __commonJS({
  "node_modules/protobufjs/src/rpc.js"(exports2) {
    "use strict";
    var rpc = exports2;
    rpc.Service = require_service();
  }
});

// node_modules/protobufjs/src/roots.js
var require_roots = __commonJS({
  "node_modules/protobufjs/src/roots.js"(exports2, module2) {
    "use strict";
    module2.exports = {};
  }
});

// node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = __commonJS({
  "node_modules/protobufjs/src/index-minimal.js"(exports2) {
    "use strict";
    var protobuf = exports2;
    protobuf.build = "minimal";
    protobuf.Writer = require_writer();
    protobuf.BufferWriter = require_writer_buffer();
    protobuf.Reader = require_reader();
    protobuf.BufferReader = require_reader_buffer();
    protobuf.util = require_minimal();
    protobuf.rpc = require_rpc();
    protobuf.roots = require_roots();
    protobuf.configure = configure;
    function configure() {
      protobuf.util._configure();
      protobuf.Writer._configure(protobuf.BufferWriter);
      protobuf.Reader._configure(protobuf.BufferReader);
    }
    configure();
  }
});

// node_modules/protobufjs/minimal.js
var require_minimal2 = __commonJS({
  "node_modules/protobufjs/minimal.js"(exports2, module2) {
    "use strict";
    module2.exports = require_index_minimal();
  }
});

// node_modules/sparkplug-payload/lib/sparkplugPayloadProto.js
var require_sparkplugPayloadProto = __commonJS({
  "node_modules/sparkplug-payload/lib/sparkplugPayloadProto.js"(exports2, module2) {
    "use strict";
    var $protobuf = require_minimal2();
    var $Reader = $protobuf.Reader;
    var $Writer = $protobuf.Writer;
    var $util = $protobuf.util;
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    $root.org = (function() {
      var org = {};
      org.eclipse = (function() {
        var eclipse = {};
        eclipse.tahu = (function() {
          var tahu = {};
          tahu.protobuf = (function() {
            var protobuf = {};
            protobuf.DataType = (function() {
              var valuesById = {}, values = Object.create(valuesById);
              values[valuesById[0] = "Unknown"] = 0;
              values[valuesById[1] = "Int8"] = 1;
              values[valuesById[2] = "Int16"] = 2;
              values[valuesById[3] = "Int32"] = 3;
              values[valuesById[4] = "Int64"] = 4;
              values[valuesById[5] = "UInt8"] = 5;
              values[valuesById[6] = "UInt16"] = 6;
              values[valuesById[7] = "UInt32"] = 7;
              values[valuesById[8] = "UInt64"] = 8;
              values[valuesById[9] = "Float"] = 9;
              values[valuesById[10] = "Double"] = 10;
              values[valuesById[11] = "Boolean"] = 11;
              values[valuesById[12] = "String"] = 12;
              values[valuesById[13] = "DateTime"] = 13;
              values[valuesById[14] = "Text"] = 14;
              values[valuesById[15] = "UUID"] = 15;
              values[valuesById[16] = "DataSet"] = 16;
              values[valuesById[17] = "Bytes"] = 17;
              values[valuesById[18] = "File"] = 18;
              values[valuesById[19] = "Template"] = 19;
              values[valuesById[20] = "PropertySet"] = 20;
              values[valuesById[21] = "PropertySetList"] = 21;
              values[valuesById[22] = "Int8Array"] = 22;
              values[valuesById[23] = "Int16Array"] = 23;
              values[valuesById[24] = "Int32Array"] = 24;
              values[valuesById[25] = "Int64Array"] = 25;
              values[valuesById[26] = "UInt8Array"] = 26;
              values[valuesById[27] = "UInt16Array"] = 27;
              values[valuesById[28] = "UInt32Array"] = 28;
              values[valuesById[29] = "UInt64Array"] = 29;
              values[valuesById[30] = "FloatArray"] = 30;
              values[valuesById[31] = "DoubleArray"] = 31;
              values[valuesById[32] = "BooleanArray"] = 32;
              values[valuesById[33] = "StringArray"] = 33;
              values[valuesById[34] = "DateTimeArray"] = 34;
              return values;
            })();
            protobuf.Payload = (function() {
              function Payload(properties) {
                this.metrics = [];
                if (properties) {
                  for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                      this[keys[i]] = properties[keys[i]];
                }
              }
              Payload.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
              Payload.prototype.metrics = $util.emptyArray;
              Payload.prototype.seq = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
              Payload.prototype.uuid = "";
              Payload.prototype.body = $util.newBuffer([]);
              Payload.create = function create(properties) {
                return new Payload(properties);
              };
              Payload.encode = function encode(message, writer) {
                if (!writer)
                  writer = $Writer.create();
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                  writer.uint32(
                    /* id 1, wireType 0 =*/
                    8
                  ).uint64(message.timestamp);
                if (message.metrics != null && message.metrics.length)
                  for (var i = 0; i < message.metrics.length; ++i)
                    $root.org.eclipse.tahu.protobuf.Payload.Metric.encode(message.metrics[i], writer.uint32(
                      /* id 2, wireType 2 =*/
                      18
                    ).fork()).ldelim();
                if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
                  writer.uint32(
                    /* id 3, wireType 0 =*/
                    24
                  ).uint64(message.seq);
                if (message.uuid != null && Object.hasOwnProperty.call(message, "uuid"))
                  writer.uint32(
                    /* id 4, wireType 2 =*/
                    34
                  ).string(message.uuid);
                if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                  writer.uint32(
                    /* id 5, wireType 2 =*/
                    42
                  ).bytes(message.body);
                return writer;
              };
              Payload.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
              };
              Payload.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                  reader = $Reader.create(reader);
                var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload();
                while (reader.pos < end) {
                  var tag = reader.uint32();
                  switch (tag >>> 3) {
                    case 1:
                      message.timestamp = reader.uint64();
                      break;
                    case 2:
                      if (!(message.metrics && message.metrics.length))
                        message.metrics = [];
                      message.metrics.push($root.org.eclipse.tahu.protobuf.Payload.Metric.decode(reader, reader.uint32()));
                      break;
                    case 3:
                      message.seq = reader.uint64();
                      break;
                    case 4:
                      message.uuid = reader.string();
                      break;
                    case 5:
                      message.body = reader.bytes();
                      break;
                    default:
                      reader.skipType(tag & 7);
                      break;
                  }
                }
                return message;
              };
              Payload.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              Payload.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                  return "object expected";
                if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
                  if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
                }
                if (message.metrics != null && message.hasOwnProperty("metrics")) {
                  if (!Array.isArray(message.metrics))
                    return "metrics: array expected";
                  for (var i = 0; i < message.metrics.length; ++i) {
                    var error = $root.org.eclipse.tahu.protobuf.Payload.Metric.verify(message.metrics[i]);
                    if (error)
                      return "metrics." + error;
                  }
                }
                if (message.seq != null && message.hasOwnProperty("seq")) {
                  if (!$util.isInteger(message.seq) && !(message.seq && $util.isInteger(message.seq.low) && $util.isInteger(message.seq.high)))
                    return "seq: integer|Long expected";
                }
                if (message.uuid != null && message.hasOwnProperty("uuid")) {
                  if (!$util.isString(message.uuid))
                    return "uuid: string expected";
                }
                if (message.body != null && message.hasOwnProperty("body")) {
                  if (!(message.body && typeof message.body.length === "number" || $util.isString(message.body)))
                    return "body: buffer expected";
                }
                return null;
              };
              Payload.fromObject = function fromObject(object) {
                if (object instanceof $root.org.eclipse.tahu.protobuf.Payload)
                  return object;
                var message = new $root.org.eclipse.tahu.protobuf.Payload();
                if (object.timestamp != null) {
                  if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                  else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                  else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                  else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
                }
                if (object.metrics) {
                  if (!Array.isArray(object.metrics))
                    throw TypeError(".org.eclipse.tahu.protobuf.Payload.metrics: array expected");
                  message.metrics = [];
                  for (var i = 0; i < object.metrics.length; ++i) {
                    if (typeof object.metrics[i] !== "object")
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.metrics: object expected");
                    message.metrics[i] = $root.org.eclipse.tahu.protobuf.Payload.Metric.fromObject(object.metrics[i]);
                  }
                }
                if (object.seq != null) {
                  if ($util.Long)
                    (message.seq = $util.Long.fromValue(object.seq)).unsigned = true;
                  else if (typeof object.seq === "string")
                    message.seq = parseInt(object.seq, 10);
                  else if (typeof object.seq === "number")
                    message.seq = object.seq;
                  else if (typeof object.seq === "object")
                    message.seq = new $util.LongBits(object.seq.low >>> 0, object.seq.high >>> 0).toNumber(true);
                }
                if (object.uuid != null)
                  message.uuid = String(object.uuid);
                if (object.body != null) {
                  if (typeof object.body === "string")
                    $util.base64.decode(object.body, message.body = $util.newBuffer($util.base64.length(object.body)), 0);
                  else if (object.body.length)
                    message.body = object.body;
                }
                return message;
              };
              Payload.toObject = function toObject(message, options) {
                if (!options)
                  options = {};
                var object = {};
                if (options.arrays || options.defaults)
                  object.metrics = [];
                if (options.defaults) {
                  if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                  } else
                    object.timestamp = options.longs === String ? "0" : 0;
                  if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.seq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                  } else
                    object.seq = options.longs === String ? "0" : 0;
                  object.uuid = "";
                  if (options.bytes === String)
                    object.body = "";
                  else {
                    object.body = [];
                    if (options.bytes !== Array)
                      object.body = $util.newBuffer(object.body);
                  }
                }
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                  if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                  else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
                if (message.metrics && message.metrics.length) {
                  object.metrics = [];
                  for (var j = 0; j < message.metrics.length; ++j)
                    object.metrics[j] = $root.org.eclipse.tahu.protobuf.Payload.Metric.toObject(message.metrics[j], options);
                }
                if (message.seq != null && message.hasOwnProperty("seq"))
                  if (typeof message.seq === "number")
                    object.seq = options.longs === String ? String(message.seq) : message.seq;
                  else
                    object.seq = options.longs === String ? $util.Long.prototype.toString.call(message.seq) : options.longs === Number ? new $util.LongBits(message.seq.low >>> 0, message.seq.high >>> 0).toNumber(true) : message.seq;
                if (message.uuid != null && message.hasOwnProperty("uuid"))
                  object.uuid = message.uuid;
                if (message.body != null && message.hasOwnProperty("body"))
                  object.body = options.bytes === String ? $util.base64.encode(message.body, 0, message.body.length) : options.bytes === Array ? Array.prototype.slice.call(message.body) : message.body;
                return object;
              };
              Payload.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
              };
              Payload.Template = (function() {
                function Template(properties) {
                  this.metrics = [];
                  this.parameters = [];
                  if (properties) {
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
                  }
                }
                Template.prototype.version = "";
                Template.prototype.metrics = $util.emptyArray;
                Template.prototype.parameters = $util.emptyArray;
                Template.prototype.templateRef = "";
                Template.prototype.isDefinition = false;
                Template.create = function create(properties) {
                  return new Template(properties);
                };
                Template.encode = function encode(message, writer) {
                  if (!writer)
                    writer = $Writer.create();
                  if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                    writer.uint32(
                      /* id 1, wireType 2 =*/
                      10
                    ).string(message.version);
                  if (message.metrics != null && message.metrics.length)
                    for (var i = 0; i < message.metrics.length; ++i)
                      $root.org.eclipse.tahu.protobuf.Payload.Metric.encode(message.metrics[i], writer.uint32(
                        /* id 2, wireType 2 =*/
                        18
                      ).fork()).ldelim();
                  if (message.parameters != null && message.parameters.length)
                    for (var i = 0; i < message.parameters.length; ++i)
                      $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.encode(message.parameters[i], writer.uint32(
                        /* id 3, wireType 2 =*/
                        26
                      ).fork()).ldelim();
                  if (message.templateRef != null && Object.hasOwnProperty.call(message, "templateRef"))
                    writer.uint32(
                      /* id 4, wireType 2 =*/
                      34
                    ).string(message.templateRef);
                  if (message.isDefinition != null && Object.hasOwnProperty.call(message, "isDefinition"))
                    writer.uint32(
                      /* id 5, wireType 0 =*/
                      40
                    ).bool(message.isDefinition);
                  return writer;
                };
                Template.encodeDelimited = function encodeDelimited(message, writer) {
                  return this.encode(message, writer).ldelim();
                };
                Template.decode = function decode(reader, length) {
                  if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                  var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.Template();
                  while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                      case 1:
                        message.version = reader.string();
                        break;
                      case 2:
                        if (!(message.metrics && message.metrics.length))
                          message.metrics = [];
                        message.metrics.push($root.org.eclipse.tahu.protobuf.Payload.Metric.decode(reader, reader.uint32()));
                        break;
                      case 3:
                        if (!(message.parameters && message.parameters.length))
                          message.parameters = [];
                        message.parameters.push($root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.decode(reader, reader.uint32()));
                        break;
                      case 4:
                        message.templateRef = reader.string();
                        break;
                      case 5:
                        message.isDefinition = reader.bool();
                        break;
                      default:
                        reader.skipType(tag & 7);
                        break;
                    }
                  }
                  return message;
                };
                Template.decodeDelimited = function decodeDelimited(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                Template.verify = function verify(message) {
                  if (typeof message !== "object" || message === null)
                    return "object expected";
                  if (message.version != null && message.hasOwnProperty("version")) {
                    if (!$util.isString(message.version))
                      return "version: string expected";
                  }
                  if (message.metrics != null && message.hasOwnProperty("metrics")) {
                    if (!Array.isArray(message.metrics))
                      return "metrics: array expected";
                    for (var i = 0; i < message.metrics.length; ++i) {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.Metric.verify(message.metrics[i]);
                      if (error)
                        return "metrics." + error;
                    }
                  }
                  if (message.parameters != null && message.hasOwnProperty("parameters")) {
                    if (!Array.isArray(message.parameters))
                      return "parameters: array expected";
                    for (var i = 0; i < message.parameters.length; ++i) {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.verify(message.parameters[i]);
                      if (error)
                        return "parameters." + error;
                    }
                  }
                  if (message.templateRef != null && message.hasOwnProperty("templateRef")) {
                    if (!$util.isString(message.templateRef))
                      return "templateRef: string expected";
                  }
                  if (message.isDefinition != null && message.hasOwnProperty("isDefinition")) {
                    if (typeof message.isDefinition !== "boolean")
                      return "isDefinition: boolean expected";
                  }
                  return null;
                };
                Template.fromObject = function fromObject(object) {
                  if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.Template)
                    return object;
                  var message = new $root.org.eclipse.tahu.protobuf.Payload.Template();
                  if (object.version != null)
                    message.version = String(object.version);
                  if (object.metrics) {
                    if (!Array.isArray(object.metrics))
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.Template.metrics: array expected");
                    message.metrics = [];
                    for (var i = 0; i < object.metrics.length; ++i) {
                      if (typeof object.metrics[i] !== "object")
                        throw TypeError(".org.eclipse.tahu.protobuf.Payload.Template.metrics: object expected");
                      message.metrics[i] = $root.org.eclipse.tahu.protobuf.Payload.Metric.fromObject(object.metrics[i]);
                    }
                  }
                  if (object.parameters) {
                    if (!Array.isArray(object.parameters))
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.Template.parameters: array expected");
                    message.parameters = [];
                    for (var i = 0; i < object.parameters.length; ++i) {
                      if (typeof object.parameters[i] !== "object")
                        throw TypeError(".org.eclipse.tahu.protobuf.Payload.Template.parameters: object expected");
                      message.parameters[i] = $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.fromObject(object.parameters[i]);
                    }
                  }
                  if (object.templateRef != null)
                    message.templateRef = String(object.templateRef);
                  if (object.isDefinition != null)
                    message.isDefinition = Boolean(object.isDefinition);
                  return message;
                };
                Template.toObject = function toObject(message, options) {
                  if (!options)
                    options = {};
                  var object = {};
                  if (options.arrays || options.defaults) {
                    object.metrics = [];
                    object.parameters = [];
                  }
                  if (options.defaults) {
                    object.version = "";
                    object.templateRef = "";
                    object.isDefinition = false;
                  }
                  if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                  if (message.metrics && message.metrics.length) {
                    object.metrics = [];
                    for (var j = 0; j < message.metrics.length; ++j)
                      object.metrics[j] = $root.org.eclipse.tahu.protobuf.Payload.Metric.toObject(message.metrics[j], options);
                  }
                  if (message.parameters && message.parameters.length) {
                    object.parameters = [];
                    for (var j = 0; j < message.parameters.length; ++j)
                      object.parameters[j] = $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.toObject(message.parameters[j], options);
                  }
                  if (message.templateRef != null && message.hasOwnProperty("templateRef"))
                    object.templateRef = message.templateRef;
                  if (message.isDefinition != null && message.hasOwnProperty("isDefinition"))
                    object.isDefinition = message.isDefinition;
                  return object;
                };
                Template.prototype.toJSON = function toJSON() {
                  return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
                Template.Parameter = (function() {
                  function Parameter(properties) {
                    if (properties) {
                      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                          this[keys[i]] = properties[keys[i]];
                    }
                  }
                  Parameter.prototype.name = "";
                  Parameter.prototype.type = 0;
                  Parameter.prototype.intValue = null;
                  Parameter.prototype.longValue = null;
                  Parameter.prototype.floatValue = null;
                  Parameter.prototype.doubleValue = null;
                  Parameter.prototype.booleanValue = null;
                  Parameter.prototype.stringValue = null;
                  Parameter.prototype.extensionValue = null;
                  var $oneOfFields;
                  Object.defineProperty(Parameter.prototype, "value", {
                    get: $util.oneOfGetter($oneOfFields = ["intValue", "longValue", "floatValue", "doubleValue", "booleanValue", "stringValue", "extensionValue"]),
                    set: $util.oneOfSetter($oneOfFields)
                  });
                  Parameter.create = function create(properties) {
                    return new Parameter(properties);
                  };
                  Parameter.encode = function encode(message, writer) {
                    if (!writer)
                      writer = $Writer.create();
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                      writer.uint32(
                        /* id 1, wireType 2 =*/
                        10
                      ).string(message.name);
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                      writer.uint32(
                        /* id 2, wireType 0 =*/
                        16
                      ).uint32(message.type);
                    if (message.intValue != null && Object.hasOwnProperty.call(message, "intValue"))
                      writer.uint32(
                        /* id 3, wireType 0 =*/
                        24
                      ).uint32(message.intValue);
                    if (message.longValue != null && Object.hasOwnProperty.call(message, "longValue"))
                      writer.uint32(
                        /* id 4, wireType 0 =*/
                        32
                      ).uint64(message.longValue);
                    if (message.floatValue != null && Object.hasOwnProperty.call(message, "floatValue"))
                      writer.uint32(
                        /* id 5, wireType 5 =*/
                        45
                      ).float(message.floatValue);
                    if (message.doubleValue != null && Object.hasOwnProperty.call(message, "doubleValue"))
                      writer.uint32(
                        /* id 6, wireType 1 =*/
                        49
                      ).double(message.doubleValue);
                    if (message.booleanValue != null && Object.hasOwnProperty.call(message, "booleanValue"))
                      writer.uint32(
                        /* id 7, wireType 0 =*/
                        56
                      ).bool(message.booleanValue);
                    if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue"))
                      writer.uint32(
                        /* id 8, wireType 2 =*/
                        66
                      ).string(message.stringValue);
                    if (message.extensionValue != null && Object.hasOwnProperty.call(message, "extensionValue"))
                      $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.ParameterValueExtension.encode(message.extensionValue, writer.uint32(
                        /* id 9, wireType 2 =*/
                        74
                      ).fork()).ldelim();
                    return writer;
                  };
                  Parameter.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                  };
                  Parameter.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                      reader = $Reader.create(reader);
                    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter();
                    while (reader.pos < end) {
                      var tag = reader.uint32();
                      switch (tag >>> 3) {
                        case 1:
                          message.name = reader.string();
                          break;
                        case 2:
                          message.type = reader.uint32();
                          break;
                        case 3:
                          message.intValue = reader.uint32();
                          break;
                        case 4:
                          message.longValue = reader.uint64();
                          break;
                        case 5:
                          message.floatValue = reader.float();
                          break;
                        case 6:
                          message.doubleValue = reader.double();
                          break;
                        case 7:
                          message.booleanValue = reader.bool();
                          break;
                        case 8:
                          message.stringValue = reader.string();
                          break;
                        case 9:
                          message.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.ParameterValueExtension.decode(reader, reader.uint32());
                          break;
                        default:
                          reader.skipType(tag & 7);
                          break;
                      }
                    }
                    return message;
                  };
                  Parameter.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                      reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                  };
                  Parameter.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                      return "object expected";
                    var properties = {};
                    if (message.name != null && message.hasOwnProperty("name")) {
                      if (!$util.isString(message.name))
                        return "name: string expected";
                    }
                    if (message.type != null && message.hasOwnProperty("type")) {
                      if (!$util.isInteger(message.type))
                        return "type: integer expected";
                    }
                    if (message.intValue != null && message.hasOwnProperty("intValue")) {
                      properties.value = 1;
                      if (!$util.isInteger(message.intValue))
                        return "intValue: integer expected";
                    }
                    if (message.longValue != null && message.hasOwnProperty("longValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      if (!$util.isInteger(message.longValue) && !(message.longValue && $util.isInteger(message.longValue.low) && $util.isInteger(message.longValue.high)))
                        return "longValue: integer|Long expected";
                    }
                    if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      if (typeof message.floatValue !== "number")
                        return "floatValue: number expected";
                    }
                    if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      if (typeof message.doubleValue !== "number")
                        return "doubleValue: number expected";
                    }
                    if (message.booleanValue != null && message.hasOwnProperty("booleanValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      if (typeof message.booleanValue !== "boolean")
                        return "booleanValue: boolean expected";
                    }
                    if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      if (!$util.isString(message.stringValue))
                        return "stringValue: string expected";
                    }
                    if (message.extensionValue != null && message.hasOwnProperty("extensionValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      {
                        var error = $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.ParameterValueExtension.verify(message.extensionValue);
                        if (error)
                          return "extensionValue." + error;
                      }
                    }
                    return null;
                  };
                  Parameter.fromObject = function fromObject(object) {
                    if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter)
                      return object;
                    var message = new $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter();
                    if (object.name != null)
                      message.name = String(object.name);
                    if (object.type != null)
                      message.type = object.type >>> 0;
                    if (object.intValue != null)
                      message.intValue = object.intValue >>> 0;
                    if (object.longValue != null) {
                      if ($util.Long)
                        (message.longValue = $util.Long.fromValue(object.longValue)).unsigned = true;
                      else if (typeof object.longValue === "string")
                        message.longValue = parseInt(object.longValue, 10);
                      else if (typeof object.longValue === "number")
                        message.longValue = object.longValue;
                      else if (typeof object.longValue === "object")
                        message.longValue = new $util.LongBits(object.longValue.low >>> 0, object.longValue.high >>> 0).toNumber(true);
                    }
                    if (object.floatValue != null)
                      message.floatValue = Number(object.floatValue);
                    if (object.doubleValue != null)
                      message.doubleValue = Number(object.doubleValue);
                    if (object.booleanValue != null)
                      message.booleanValue = Boolean(object.booleanValue);
                    if (object.stringValue != null)
                      message.stringValue = String(object.stringValue);
                    if (object.extensionValue != null) {
                      if (typeof object.extensionValue !== "object")
                        throw TypeError(".org.eclipse.tahu.protobuf.Payload.Template.Parameter.extensionValue: object expected");
                      message.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.ParameterValueExtension.fromObject(object.extensionValue);
                    }
                    return message;
                  };
                  Parameter.toObject = function toObject(message, options) {
                    if (!options)
                      options = {};
                    var object = {};
                    if (options.defaults) {
                      object.name = "";
                      object.type = 0;
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                      object.name = message.name;
                    if (message.type != null && message.hasOwnProperty("type"))
                      object.type = message.type;
                    if (message.intValue != null && message.hasOwnProperty("intValue")) {
                      object.intValue = message.intValue;
                      if (options.oneofs)
                        object.value = "intValue";
                    }
                    if (message.longValue != null && message.hasOwnProperty("longValue")) {
                      if (typeof message.longValue === "number")
                        object.longValue = options.longs === String ? String(message.longValue) : message.longValue;
                      else
                        object.longValue = options.longs === String ? $util.Long.prototype.toString.call(message.longValue) : options.longs === Number ? new $util.LongBits(message.longValue.low >>> 0, message.longValue.high >>> 0).toNumber(true) : message.longValue;
                      if (options.oneofs)
                        object.value = "longValue";
                    }
                    if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                      object.floatValue = options.json && !isFinite(message.floatValue) ? String(message.floatValue) : message.floatValue;
                      if (options.oneofs)
                        object.value = "floatValue";
                    }
                    if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                      object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
                      if (options.oneofs)
                        object.value = "doubleValue";
                    }
                    if (message.booleanValue != null && message.hasOwnProperty("booleanValue")) {
                      object.booleanValue = message.booleanValue;
                      if (options.oneofs)
                        object.value = "booleanValue";
                    }
                    if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                      object.stringValue = message.stringValue;
                      if (options.oneofs)
                        object.value = "stringValue";
                    }
                    if (message.extensionValue != null && message.hasOwnProperty("extensionValue")) {
                      object.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.ParameterValueExtension.toObject(message.extensionValue, options);
                      if (options.oneofs)
                        object.value = "extensionValue";
                    }
                    return object;
                  };
                  Parameter.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                  };
                  Parameter.ParameterValueExtension = (function() {
                    function ParameterValueExtension(properties) {
                      if (properties) {
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                          if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
                      }
                    }
                    ParameterValueExtension.create = function create(properties) {
                      return new ParameterValueExtension(properties);
                    };
                    ParameterValueExtension.encode = function encode(message, writer) {
                      if (!writer)
                        writer = $Writer.create();
                      return writer;
                    };
                    ParameterValueExtension.encodeDelimited = function encodeDelimited(message, writer) {
                      return this.encode(message, writer).ldelim();
                    };
                    ParameterValueExtension.decode = function decode(reader, length) {
                      if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                      var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.ParameterValueExtension();
                      while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                          default:
                            reader.skipType(tag & 7);
                            break;
                        }
                      }
                      return message;
                    };
                    ParameterValueExtension.decodeDelimited = function decodeDelimited(reader) {
                      if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                      return this.decode(reader, reader.uint32());
                    };
                    ParameterValueExtension.verify = function verify(message) {
                      if (typeof message !== "object" || message === null)
                        return "object expected";
                      return null;
                    };
                    ParameterValueExtension.fromObject = function fromObject(object) {
                      if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.ParameterValueExtension)
                        return object;
                      return new $root.org.eclipse.tahu.protobuf.Payload.Template.Parameter.ParameterValueExtension();
                    };
                    ParameterValueExtension.toObject = function toObject() {
                      return {};
                    };
                    ParameterValueExtension.prototype.toJSON = function toJSON() {
                      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
                    return ParameterValueExtension;
                  })();
                  return Parameter;
                })();
                return Template;
              })();
              Payload.DataSet = (function() {
                function DataSet(properties) {
                  this.columns = [];
                  this.types = [];
                  this.rows = [];
                  if (properties) {
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
                  }
                }
                DataSet.prototype.numOfColumns = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
                DataSet.prototype.columns = $util.emptyArray;
                DataSet.prototype.types = $util.emptyArray;
                DataSet.prototype.rows = $util.emptyArray;
                DataSet.create = function create(properties) {
                  return new DataSet(properties);
                };
                DataSet.encode = function encode(message, writer) {
                  if (!writer)
                    writer = $Writer.create();
                  if (message.numOfColumns != null && Object.hasOwnProperty.call(message, "numOfColumns"))
                    writer.uint32(
                      /* id 1, wireType 0 =*/
                      8
                    ).uint64(message.numOfColumns);
                  if (message.columns != null && message.columns.length)
                    for (var i = 0; i < message.columns.length; ++i)
                      writer.uint32(
                        /* id 2, wireType 2 =*/
                        18
                      ).string(message.columns[i]);
                  if (message.types != null && message.types.length)
                    for (var i = 0; i < message.types.length; ++i)
                      writer.uint32(
                        /* id 3, wireType 0 =*/
                        24
                      ).uint32(message.types[i]);
                  if (message.rows != null && message.rows.length)
                    for (var i = 0; i < message.rows.length; ++i)
                      $root.org.eclipse.tahu.protobuf.Payload.DataSet.Row.encode(message.rows[i], writer.uint32(
                        /* id 4, wireType 2 =*/
                        34
                      ).fork()).ldelim();
                  return writer;
                };
                DataSet.encodeDelimited = function encodeDelimited(message, writer) {
                  return this.encode(message, writer).ldelim();
                };
                DataSet.decode = function decode(reader, length) {
                  if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                  var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.DataSet();
                  while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                      case 1:
                        message.numOfColumns = reader.uint64();
                        break;
                      case 2:
                        if (!(message.columns && message.columns.length))
                          message.columns = [];
                        message.columns.push(reader.string());
                        break;
                      case 3:
                        if (!(message.types && message.types.length))
                          message.types = [];
                        if ((tag & 7) === 2) {
                          var end2 = reader.uint32() + reader.pos;
                          while (reader.pos < end2)
                            message.types.push(reader.uint32());
                        } else
                          message.types.push(reader.uint32());
                        break;
                      case 4:
                        if (!(message.rows && message.rows.length))
                          message.rows = [];
                        message.rows.push($root.org.eclipse.tahu.protobuf.Payload.DataSet.Row.decode(reader, reader.uint32()));
                        break;
                      default:
                        reader.skipType(tag & 7);
                        break;
                    }
                  }
                  return message;
                };
                DataSet.decodeDelimited = function decodeDelimited(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                DataSet.verify = function verify(message) {
                  if (typeof message !== "object" || message === null)
                    return "object expected";
                  if (message.numOfColumns != null && message.hasOwnProperty("numOfColumns")) {
                    if (!$util.isInteger(message.numOfColumns) && !(message.numOfColumns && $util.isInteger(message.numOfColumns.low) && $util.isInteger(message.numOfColumns.high)))
                      return "numOfColumns: integer|Long expected";
                  }
                  if (message.columns != null && message.hasOwnProperty("columns")) {
                    if (!Array.isArray(message.columns))
                      return "columns: array expected";
                    for (var i = 0; i < message.columns.length; ++i)
                      if (!$util.isString(message.columns[i]))
                        return "columns: string[] expected";
                  }
                  if (message.types != null && message.hasOwnProperty("types")) {
                    if (!Array.isArray(message.types))
                      return "types: array expected";
                    for (var i = 0; i < message.types.length; ++i)
                      if (!$util.isInteger(message.types[i]))
                        return "types: integer[] expected";
                  }
                  if (message.rows != null && message.hasOwnProperty("rows")) {
                    if (!Array.isArray(message.rows))
                      return "rows: array expected";
                    for (var i = 0; i < message.rows.length; ++i) {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.DataSet.Row.verify(message.rows[i]);
                      if (error)
                        return "rows." + error;
                    }
                  }
                  return null;
                };
                DataSet.fromObject = function fromObject(object) {
                  if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.DataSet)
                    return object;
                  var message = new $root.org.eclipse.tahu.protobuf.Payload.DataSet();
                  if (object.numOfColumns != null) {
                    if ($util.Long)
                      (message.numOfColumns = $util.Long.fromValue(object.numOfColumns)).unsigned = true;
                    else if (typeof object.numOfColumns === "string")
                      message.numOfColumns = parseInt(object.numOfColumns, 10);
                    else if (typeof object.numOfColumns === "number")
                      message.numOfColumns = object.numOfColumns;
                    else if (typeof object.numOfColumns === "object")
                      message.numOfColumns = new $util.LongBits(object.numOfColumns.low >>> 0, object.numOfColumns.high >>> 0).toNumber(true);
                  }
                  if (object.columns) {
                    if (!Array.isArray(object.columns))
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.DataSet.columns: array expected");
                    message.columns = [];
                    for (var i = 0; i < object.columns.length; ++i)
                      message.columns[i] = String(object.columns[i]);
                  }
                  if (object.types) {
                    if (!Array.isArray(object.types))
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.DataSet.types: array expected");
                    message.types = [];
                    for (var i = 0; i < object.types.length; ++i)
                      message.types[i] = object.types[i] >>> 0;
                  }
                  if (object.rows) {
                    if (!Array.isArray(object.rows))
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.DataSet.rows: array expected");
                    message.rows = [];
                    for (var i = 0; i < object.rows.length; ++i) {
                      if (typeof object.rows[i] !== "object")
                        throw TypeError(".org.eclipse.tahu.protobuf.Payload.DataSet.rows: object expected");
                      message.rows[i] = $root.org.eclipse.tahu.protobuf.Payload.DataSet.Row.fromObject(object.rows[i]);
                    }
                  }
                  return message;
                };
                DataSet.toObject = function toObject(message, options) {
                  if (!options)
                    options = {};
                  var object = {};
                  if (options.arrays || options.defaults) {
                    object.columns = [];
                    object.types = [];
                    object.rows = [];
                  }
                  if (options.defaults)
                    if ($util.Long) {
                      var long = new $util.Long(0, 0, true);
                      object.numOfColumns = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                      object.numOfColumns = options.longs === String ? "0" : 0;
                  if (message.numOfColumns != null && message.hasOwnProperty("numOfColumns"))
                    if (typeof message.numOfColumns === "number")
                      object.numOfColumns = options.longs === String ? String(message.numOfColumns) : message.numOfColumns;
                    else
                      object.numOfColumns = options.longs === String ? $util.Long.prototype.toString.call(message.numOfColumns) : options.longs === Number ? new $util.LongBits(message.numOfColumns.low >>> 0, message.numOfColumns.high >>> 0).toNumber(true) : message.numOfColumns;
                  if (message.columns && message.columns.length) {
                    object.columns = [];
                    for (var j = 0; j < message.columns.length; ++j)
                      object.columns[j] = message.columns[j];
                  }
                  if (message.types && message.types.length) {
                    object.types = [];
                    for (var j = 0; j < message.types.length; ++j)
                      object.types[j] = message.types[j];
                  }
                  if (message.rows && message.rows.length) {
                    object.rows = [];
                    for (var j = 0; j < message.rows.length; ++j)
                      object.rows[j] = $root.org.eclipse.tahu.protobuf.Payload.DataSet.Row.toObject(message.rows[j], options);
                  }
                  return object;
                };
                DataSet.prototype.toJSON = function toJSON() {
                  return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
                DataSet.DataSetValue = (function() {
                  function DataSetValue(properties) {
                    if (properties) {
                      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                          this[keys[i]] = properties[keys[i]];
                    }
                  }
                  DataSetValue.prototype.intValue = null;
                  DataSetValue.prototype.longValue = null;
                  DataSetValue.prototype.floatValue = null;
                  DataSetValue.prototype.doubleValue = null;
                  DataSetValue.prototype.booleanValue = null;
                  DataSetValue.prototype.stringValue = null;
                  DataSetValue.prototype.extensionValue = null;
                  var $oneOfFields;
                  Object.defineProperty(DataSetValue.prototype, "value", {
                    get: $util.oneOfGetter($oneOfFields = ["intValue", "longValue", "floatValue", "doubleValue", "booleanValue", "stringValue", "extensionValue"]),
                    set: $util.oneOfSetter($oneOfFields)
                  });
                  DataSetValue.create = function create(properties) {
                    return new DataSetValue(properties);
                  };
                  DataSetValue.encode = function encode(message, writer) {
                    if (!writer)
                      writer = $Writer.create();
                    if (message.intValue != null && Object.hasOwnProperty.call(message, "intValue"))
                      writer.uint32(
                        /* id 1, wireType 0 =*/
                        8
                      ).uint32(message.intValue);
                    if (message.longValue != null && Object.hasOwnProperty.call(message, "longValue"))
                      writer.uint32(
                        /* id 2, wireType 0 =*/
                        16
                      ).uint64(message.longValue);
                    if (message.floatValue != null && Object.hasOwnProperty.call(message, "floatValue"))
                      writer.uint32(
                        /* id 3, wireType 5 =*/
                        29
                      ).float(message.floatValue);
                    if (message.doubleValue != null && Object.hasOwnProperty.call(message, "doubleValue"))
                      writer.uint32(
                        /* id 4, wireType 1 =*/
                        33
                      ).double(message.doubleValue);
                    if (message.booleanValue != null && Object.hasOwnProperty.call(message, "booleanValue"))
                      writer.uint32(
                        /* id 5, wireType 0 =*/
                        40
                      ).bool(message.booleanValue);
                    if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue"))
                      writer.uint32(
                        /* id 6, wireType 2 =*/
                        50
                      ).string(message.stringValue);
                    if (message.extensionValue != null && Object.hasOwnProperty.call(message, "extensionValue"))
                      $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.DataSetValueExtension.encode(message.extensionValue, writer.uint32(
                        /* id 7, wireType 2 =*/
                        58
                      ).fork()).ldelim();
                    return writer;
                  };
                  DataSetValue.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                  };
                  DataSetValue.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                      reader = $Reader.create(reader);
                    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue();
                    while (reader.pos < end) {
                      var tag = reader.uint32();
                      switch (tag >>> 3) {
                        case 1:
                          message.intValue = reader.uint32();
                          break;
                        case 2:
                          message.longValue = reader.uint64();
                          break;
                        case 3:
                          message.floatValue = reader.float();
                          break;
                        case 4:
                          message.doubleValue = reader.double();
                          break;
                        case 5:
                          message.booleanValue = reader.bool();
                          break;
                        case 6:
                          message.stringValue = reader.string();
                          break;
                        case 7:
                          message.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.DataSetValueExtension.decode(reader, reader.uint32());
                          break;
                        default:
                          reader.skipType(tag & 7);
                          break;
                      }
                    }
                    return message;
                  };
                  DataSetValue.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                      reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                  };
                  DataSetValue.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                      return "object expected";
                    var properties = {};
                    if (message.intValue != null && message.hasOwnProperty("intValue")) {
                      properties.value = 1;
                      if (!$util.isInteger(message.intValue))
                        return "intValue: integer expected";
                    }
                    if (message.longValue != null && message.hasOwnProperty("longValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      if (!$util.isInteger(message.longValue) && !(message.longValue && $util.isInteger(message.longValue.low) && $util.isInteger(message.longValue.high)))
                        return "longValue: integer|Long expected";
                    }
                    if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      if (typeof message.floatValue !== "number")
                        return "floatValue: number expected";
                    }
                    if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      if (typeof message.doubleValue !== "number")
                        return "doubleValue: number expected";
                    }
                    if (message.booleanValue != null && message.hasOwnProperty("booleanValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      if (typeof message.booleanValue !== "boolean")
                        return "booleanValue: boolean expected";
                    }
                    if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      if (!$util.isString(message.stringValue))
                        return "stringValue: string expected";
                    }
                    if (message.extensionValue != null && message.hasOwnProperty("extensionValue")) {
                      if (properties.value === 1)
                        return "value: multiple values";
                      properties.value = 1;
                      {
                        var error = $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.DataSetValueExtension.verify(message.extensionValue);
                        if (error)
                          return "extensionValue." + error;
                      }
                    }
                    return null;
                  };
                  DataSetValue.fromObject = function fromObject(object) {
                    if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue)
                      return object;
                    var message = new $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue();
                    if (object.intValue != null)
                      message.intValue = object.intValue >>> 0;
                    if (object.longValue != null) {
                      if ($util.Long)
                        (message.longValue = $util.Long.fromValue(object.longValue)).unsigned = true;
                      else if (typeof object.longValue === "string")
                        message.longValue = parseInt(object.longValue, 10);
                      else if (typeof object.longValue === "number")
                        message.longValue = object.longValue;
                      else if (typeof object.longValue === "object")
                        message.longValue = new $util.LongBits(object.longValue.low >>> 0, object.longValue.high >>> 0).toNumber(true);
                    }
                    if (object.floatValue != null)
                      message.floatValue = Number(object.floatValue);
                    if (object.doubleValue != null)
                      message.doubleValue = Number(object.doubleValue);
                    if (object.booleanValue != null)
                      message.booleanValue = Boolean(object.booleanValue);
                    if (object.stringValue != null)
                      message.stringValue = String(object.stringValue);
                    if (object.extensionValue != null) {
                      if (typeof object.extensionValue !== "object")
                        throw TypeError(".org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.extensionValue: object expected");
                      message.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.DataSetValueExtension.fromObject(object.extensionValue);
                    }
                    return message;
                  };
                  DataSetValue.toObject = function toObject(message, options) {
                    if (!options)
                      options = {};
                    var object = {};
                    if (message.intValue != null && message.hasOwnProperty("intValue")) {
                      object.intValue = message.intValue;
                      if (options.oneofs)
                        object.value = "intValue";
                    }
                    if (message.longValue != null && message.hasOwnProperty("longValue")) {
                      if (typeof message.longValue === "number")
                        object.longValue = options.longs === String ? String(message.longValue) : message.longValue;
                      else
                        object.longValue = options.longs === String ? $util.Long.prototype.toString.call(message.longValue) : options.longs === Number ? new $util.LongBits(message.longValue.low >>> 0, message.longValue.high >>> 0).toNumber(true) : message.longValue;
                      if (options.oneofs)
                        object.value = "longValue";
                    }
                    if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                      object.floatValue = options.json && !isFinite(message.floatValue) ? String(message.floatValue) : message.floatValue;
                      if (options.oneofs)
                        object.value = "floatValue";
                    }
                    if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                      object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
                      if (options.oneofs)
                        object.value = "doubleValue";
                    }
                    if (message.booleanValue != null && message.hasOwnProperty("booleanValue")) {
                      object.booleanValue = message.booleanValue;
                      if (options.oneofs)
                        object.value = "booleanValue";
                    }
                    if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                      object.stringValue = message.stringValue;
                      if (options.oneofs)
                        object.value = "stringValue";
                    }
                    if (message.extensionValue != null && message.hasOwnProperty("extensionValue")) {
                      object.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.DataSetValueExtension.toObject(message.extensionValue, options);
                      if (options.oneofs)
                        object.value = "extensionValue";
                    }
                    return object;
                  };
                  DataSetValue.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                  };
                  DataSetValue.DataSetValueExtension = (function() {
                    function DataSetValueExtension(properties) {
                      if (properties) {
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                          if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
                      }
                    }
                    DataSetValueExtension.create = function create(properties) {
                      return new DataSetValueExtension(properties);
                    };
                    DataSetValueExtension.encode = function encode(message, writer) {
                      if (!writer)
                        writer = $Writer.create();
                      return writer;
                    };
                    DataSetValueExtension.encodeDelimited = function encodeDelimited(message, writer) {
                      return this.encode(message, writer).ldelim();
                    };
                    DataSetValueExtension.decode = function decode(reader, length) {
                      if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                      var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.DataSetValueExtension();
                      while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                          default:
                            reader.skipType(tag & 7);
                            break;
                        }
                      }
                      return message;
                    };
                    DataSetValueExtension.decodeDelimited = function decodeDelimited(reader) {
                      if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                      return this.decode(reader, reader.uint32());
                    };
                    DataSetValueExtension.verify = function verify(message) {
                      if (typeof message !== "object" || message === null)
                        return "object expected";
                      return null;
                    };
                    DataSetValueExtension.fromObject = function fromObject(object) {
                      if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.DataSetValueExtension)
                        return object;
                      return new $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.DataSetValueExtension();
                    };
                    DataSetValueExtension.toObject = function toObject() {
                      return {};
                    };
                    DataSetValueExtension.prototype.toJSON = function toJSON() {
                      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
                    return DataSetValueExtension;
                  })();
                  return DataSetValue;
                })();
                DataSet.Row = (function() {
                  function Row(properties) {
                    this.elements = [];
                    if (properties) {
                      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                          this[keys[i]] = properties[keys[i]];
                    }
                  }
                  Row.prototype.elements = $util.emptyArray;
                  Row.create = function create(properties) {
                    return new Row(properties);
                  };
                  Row.encode = function encode(message, writer) {
                    if (!writer)
                      writer = $Writer.create();
                    if (message.elements != null && message.elements.length)
                      for (var i = 0; i < message.elements.length; ++i)
                        $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.encode(message.elements[i], writer.uint32(
                          /* id 1, wireType 2 =*/
                          10
                        ).fork()).ldelim();
                    return writer;
                  };
                  Row.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                  };
                  Row.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                      reader = $Reader.create(reader);
                    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.DataSet.Row();
                    while (reader.pos < end) {
                      var tag = reader.uint32();
                      switch (tag >>> 3) {
                        case 1:
                          if (!(message.elements && message.elements.length))
                            message.elements = [];
                          message.elements.push($root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.decode(reader, reader.uint32()));
                          break;
                        default:
                          reader.skipType(tag & 7);
                          break;
                      }
                    }
                    return message;
                  };
                  Row.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                      reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                  };
                  Row.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                      return "object expected";
                    if (message.elements != null && message.hasOwnProperty("elements")) {
                      if (!Array.isArray(message.elements))
                        return "elements: array expected";
                      for (var i = 0; i < message.elements.length; ++i) {
                        var error = $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.verify(message.elements[i]);
                        if (error)
                          return "elements." + error;
                      }
                    }
                    return null;
                  };
                  Row.fromObject = function fromObject(object) {
                    if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.DataSet.Row)
                      return object;
                    var message = new $root.org.eclipse.tahu.protobuf.Payload.DataSet.Row();
                    if (object.elements) {
                      if (!Array.isArray(object.elements))
                        throw TypeError(".org.eclipse.tahu.protobuf.Payload.DataSet.Row.elements: array expected");
                      message.elements = [];
                      for (var i = 0; i < object.elements.length; ++i) {
                        if (typeof object.elements[i] !== "object")
                          throw TypeError(".org.eclipse.tahu.protobuf.Payload.DataSet.Row.elements: object expected");
                        message.elements[i] = $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.fromObject(object.elements[i]);
                      }
                    }
                    return message;
                  };
                  Row.toObject = function toObject(message, options) {
                    if (!options)
                      options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                      object.elements = [];
                    if (message.elements && message.elements.length) {
                      object.elements = [];
                      for (var j = 0; j < message.elements.length; ++j)
                        object.elements[j] = $root.org.eclipse.tahu.protobuf.Payload.DataSet.DataSetValue.toObject(message.elements[j], options);
                    }
                    return object;
                  };
                  Row.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                  };
                  return Row;
                })();
                return DataSet;
              })();
              Payload.PropertyValue = (function() {
                function PropertyValue(properties) {
                  if (properties) {
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
                  }
                }
                PropertyValue.prototype.type = 0;
                PropertyValue.prototype.isNull = false;
                PropertyValue.prototype.intValue = null;
                PropertyValue.prototype.longValue = null;
                PropertyValue.prototype.floatValue = null;
                PropertyValue.prototype.doubleValue = null;
                PropertyValue.prototype.booleanValue = null;
                PropertyValue.prototype.stringValue = null;
                PropertyValue.prototype.propertysetValue = null;
                PropertyValue.prototype.propertysetsValue = null;
                PropertyValue.prototype.extensionValue = null;
                var $oneOfFields;
                Object.defineProperty(PropertyValue.prototype, "value", {
                  get: $util.oneOfGetter($oneOfFields = ["intValue", "longValue", "floatValue", "doubleValue", "booleanValue", "stringValue", "propertysetValue", "propertysetsValue", "extensionValue"]),
                  set: $util.oneOfSetter($oneOfFields)
                });
                PropertyValue.create = function create(properties) {
                  return new PropertyValue(properties);
                };
                PropertyValue.encode = function encode(message, writer) {
                  if (!writer)
                    writer = $Writer.create();
                  if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(
                      /* id 1, wireType 0 =*/
                      8
                    ).uint32(message.type);
                  if (message.isNull != null && Object.hasOwnProperty.call(message, "isNull"))
                    writer.uint32(
                      /* id 2, wireType 0 =*/
                      16
                    ).bool(message.isNull);
                  if (message.intValue != null && Object.hasOwnProperty.call(message, "intValue"))
                    writer.uint32(
                      /* id 3, wireType 0 =*/
                      24
                    ).uint32(message.intValue);
                  if (message.longValue != null && Object.hasOwnProperty.call(message, "longValue"))
                    writer.uint32(
                      /* id 4, wireType 0 =*/
                      32
                    ).uint64(message.longValue);
                  if (message.floatValue != null && Object.hasOwnProperty.call(message, "floatValue"))
                    writer.uint32(
                      /* id 5, wireType 5 =*/
                      45
                    ).float(message.floatValue);
                  if (message.doubleValue != null && Object.hasOwnProperty.call(message, "doubleValue"))
                    writer.uint32(
                      /* id 6, wireType 1 =*/
                      49
                    ).double(message.doubleValue);
                  if (message.booleanValue != null && Object.hasOwnProperty.call(message, "booleanValue"))
                    writer.uint32(
                      /* id 7, wireType 0 =*/
                      56
                    ).bool(message.booleanValue);
                  if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue"))
                    writer.uint32(
                      /* id 8, wireType 2 =*/
                      66
                    ).string(message.stringValue);
                  if (message.propertysetValue != null && Object.hasOwnProperty.call(message, "propertysetValue"))
                    $root.org.eclipse.tahu.protobuf.Payload.PropertySet.encode(message.propertysetValue, writer.uint32(
                      /* id 9, wireType 2 =*/
                      74
                    ).fork()).ldelim();
                  if (message.propertysetsValue != null && Object.hasOwnProperty.call(message, "propertysetsValue"))
                    $root.org.eclipse.tahu.protobuf.Payload.PropertySetList.encode(message.propertysetsValue, writer.uint32(
                      /* id 10, wireType 2 =*/
                      82
                    ).fork()).ldelim();
                  if (message.extensionValue != null && Object.hasOwnProperty.call(message, "extensionValue"))
                    $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.PropertyValueExtension.encode(message.extensionValue, writer.uint32(
                      /* id 11, wireType 2 =*/
                      90
                    ).fork()).ldelim();
                  return writer;
                };
                PropertyValue.encodeDelimited = function encodeDelimited(message, writer) {
                  return this.encode(message, writer).ldelim();
                };
                PropertyValue.decode = function decode(reader, length) {
                  if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                  var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.PropertyValue();
                  while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                      case 1:
                        message.type = reader.uint32();
                        break;
                      case 2:
                        message.isNull = reader.bool();
                        break;
                      case 3:
                        message.intValue = reader.uint32();
                        break;
                      case 4:
                        message.longValue = reader.uint64();
                        break;
                      case 5:
                        message.floatValue = reader.float();
                        break;
                      case 6:
                        message.doubleValue = reader.double();
                        break;
                      case 7:
                        message.booleanValue = reader.bool();
                        break;
                      case 8:
                        message.stringValue = reader.string();
                        break;
                      case 9:
                        message.propertysetValue = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.decode(reader, reader.uint32());
                        break;
                      case 10:
                        message.propertysetsValue = $root.org.eclipse.tahu.protobuf.Payload.PropertySetList.decode(reader, reader.uint32());
                        break;
                      case 11:
                        message.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.PropertyValueExtension.decode(reader, reader.uint32());
                        break;
                      default:
                        reader.skipType(tag & 7);
                        break;
                    }
                  }
                  return message;
                };
                PropertyValue.decodeDelimited = function decodeDelimited(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                PropertyValue.verify = function verify(message) {
                  if (typeof message !== "object" || message === null)
                    return "object expected";
                  var properties = {};
                  if (message.type != null && message.hasOwnProperty("type")) {
                    if (!$util.isInteger(message.type))
                      return "type: integer expected";
                  }
                  if (message.isNull != null && message.hasOwnProperty("isNull")) {
                    if (typeof message.isNull !== "boolean")
                      return "isNull: boolean expected";
                  }
                  if (message.intValue != null && message.hasOwnProperty("intValue")) {
                    properties.value = 1;
                    if (!$util.isInteger(message.intValue))
                      return "intValue: integer expected";
                  }
                  if (message.longValue != null && message.hasOwnProperty("longValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (!$util.isInteger(message.longValue) && !(message.longValue && $util.isInteger(message.longValue.low) && $util.isInteger(message.longValue.high)))
                      return "longValue: integer|Long expected";
                  }
                  if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (typeof message.floatValue !== "number")
                      return "floatValue: number expected";
                  }
                  if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (typeof message.doubleValue !== "number")
                      return "doubleValue: number expected";
                  }
                  if (message.booleanValue != null && message.hasOwnProperty("booleanValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (typeof message.booleanValue !== "boolean")
                      return "booleanValue: boolean expected";
                  }
                  if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (!$util.isString(message.stringValue))
                      return "stringValue: string expected";
                  }
                  if (message.propertysetValue != null && message.hasOwnProperty("propertysetValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.verify(message.propertysetValue);
                      if (error)
                        return "propertysetValue." + error;
                    }
                  }
                  if (message.propertysetsValue != null && message.hasOwnProperty("propertysetsValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.PropertySetList.verify(message.propertysetsValue);
                      if (error)
                        return "propertysetsValue." + error;
                    }
                  }
                  if (message.extensionValue != null && message.hasOwnProperty("extensionValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.PropertyValueExtension.verify(message.extensionValue);
                      if (error)
                        return "extensionValue." + error;
                    }
                  }
                  return null;
                };
                PropertyValue.fromObject = function fromObject(object) {
                  if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.PropertyValue)
                    return object;
                  var message = new $root.org.eclipse.tahu.protobuf.Payload.PropertyValue();
                  if (object.type != null)
                    message.type = object.type >>> 0;
                  if (object.isNull != null)
                    message.isNull = Boolean(object.isNull);
                  if (object.intValue != null)
                    message.intValue = object.intValue >>> 0;
                  if (object.longValue != null) {
                    if ($util.Long)
                      (message.longValue = $util.Long.fromValue(object.longValue)).unsigned = true;
                    else if (typeof object.longValue === "string")
                      message.longValue = parseInt(object.longValue, 10);
                    else if (typeof object.longValue === "number")
                      message.longValue = object.longValue;
                    else if (typeof object.longValue === "object")
                      message.longValue = new $util.LongBits(object.longValue.low >>> 0, object.longValue.high >>> 0).toNumber(true);
                  }
                  if (object.floatValue != null)
                    message.floatValue = Number(object.floatValue);
                  if (object.doubleValue != null)
                    message.doubleValue = Number(object.doubleValue);
                  if (object.booleanValue != null)
                    message.booleanValue = Boolean(object.booleanValue);
                  if (object.stringValue != null)
                    message.stringValue = String(object.stringValue);
                  if (object.propertysetValue != null) {
                    if (typeof object.propertysetValue !== "object")
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.PropertyValue.propertysetValue: object expected");
                    message.propertysetValue = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.fromObject(object.propertysetValue);
                  }
                  if (object.propertysetsValue != null) {
                    if (typeof object.propertysetsValue !== "object")
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.PropertyValue.propertysetsValue: object expected");
                    message.propertysetsValue = $root.org.eclipse.tahu.protobuf.Payload.PropertySetList.fromObject(object.propertysetsValue);
                  }
                  if (object.extensionValue != null) {
                    if (typeof object.extensionValue !== "object")
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.PropertyValue.extensionValue: object expected");
                    message.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.PropertyValueExtension.fromObject(object.extensionValue);
                  }
                  return message;
                };
                PropertyValue.toObject = function toObject(message, options) {
                  if (!options)
                    options = {};
                  var object = {};
                  if (options.defaults) {
                    object.type = 0;
                    object.isNull = false;
                  }
                  if (message.type != null && message.hasOwnProperty("type"))
                    object.type = message.type;
                  if (message.isNull != null && message.hasOwnProperty("isNull"))
                    object.isNull = message.isNull;
                  if (message.intValue != null && message.hasOwnProperty("intValue")) {
                    object.intValue = message.intValue;
                    if (options.oneofs)
                      object.value = "intValue";
                  }
                  if (message.longValue != null && message.hasOwnProperty("longValue")) {
                    if (typeof message.longValue === "number")
                      object.longValue = options.longs === String ? String(message.longValue) : message.longValue;
                    else
                      object.longValue = options.longs === String ? $util.Long.prototype.toString.call(message.longValue) : options.longs === Number ? new $util.LongBits(message.longValue.low >>> 0, message.longValue.high >>> 0).toNumber(true) : message.longValue;
                    if (options.oneofs)
                      object.value = "longValue";
                  }
                  if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                    object.floatValue = options.json && !isFinite(message.floatValue) ? String(message.floatValue) : message.floatValue;
                    if (options.oneofs)
                      object.value = "floatValue";
                  }
                  if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                    object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
                    if (options.oneofs)
                      object.value = "doubleValue";
                  }
                  if (message.booleanValue != null && message.hasOwnProperty("booleanValue")) {
                    object.booleanValue = message.booleanValue;
                    if (options.oneofs)
                      object.value = "booleanValue";
                  }
                  if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    object.stringValue = message.stringValue;
                    if (options.oneofs)
                      object.value = "stringValue";
                  }
                  if (message.propertysetValue != null && message.hasOwnProperty("propertysetValue")) {
                    object.propertysetValue = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.toObject(message.propertysetValue, options);
                    if (options.oneofs)
                      object.value = "propertysetValue";
                  }
                  if (message.propertysetsValue != null && message.hasOwnProperty("propertysetsValue")) {
                    object.propertysetsValue = $root.org.eclipse.tahu.protobuf.Payload.PropertySetList.toObject(message.propertysetsValue, options);
                    if (options.oneofs)
                      object.value = "propertysetsValue";
                  }
                  if (message.extensionValue != null && message.hasOwnProperty("extensionValue")) {
                    object.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.PropertyValueExtension.toObject(message.extensionValue, options);
                    if (options.oneofs)
                      object.value = "extensionValue";
                  }
                  return object;
                };
                PropertyValue.prototype.toJSON = function toJSON() {
                  return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
                PropertyValue.PropertyValueExtension = (function() {
                  function PropertyValueExtension(properties) {
                    if (properties) {
                      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                          this[keys[i]] = properties[keys[i]];
                    }
                  }
                  PropertyValueExtension.create = function create(properties) {
                    return new PropertyValueExtension(properties);
                  };
                  PropertyValueExtension.encode = function encode(message, writer) {
                    if (!writer)
                      writer = $Writer.create();
                    return writer;
                  };
                  PropertyValueExtension.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                  };
                  PropertyValueExtension.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                      reader = $Reader.create(reader);
                    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.PropertyValueExtension();
                    while (reader.pos < end) {
                      var tag = reader.uint32();
                      switch (tag >>> 3) {
                        default:
                          reader.skipType(tag & 7);
                          break;
                      }
                    }
                    return message;
                  };
                  PropertyValueExtension.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                      reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                  };
                  PropertyValueExtension.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                      return "object expected";
                    return null;
                  };
                  PropertyValueExtension.fromObject = function fromObject(object) {
                    if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.PropertyValueExtension)
                      return object;
                    return new $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.PropertyValueExtension();
                  };
                  PropertyValueExtension.toObject = function toObject() {
                    return {};
                  };
                  PropertyValueExtension.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                  };
                  return PropertyValueExtension;
                })();
                return PropertyValue;
              })();
              Payload.PropertySet = (function() {
                function PropertySet(properties) {
                  this.keys = [];
                  this.values = [];
                  if (properties) {
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
                  }
                }
                PropertySet.prototype.keys = $util.emptyArray;
                PropertySet.prototype.values = $util.emptyArray;
                PropertySet.create = function create(properties) {
                  return new PropertySet(properties);
                };
                PropertySet.encode = function encode(message, writer) {
                  if (!writer)
                    writer = $Writer.create();
                  if (message.keys != null && message.keys.length)
                    for (var i = 0; i < message.keys.length; ++i)
                      writer.uint32(
                        /* id 1, wireType 2 =*/
                        10
                      ).string(message.keys[i]);
                  if (message.values != null && message.values.length)
                    for (var i = 0; i < message.values.length; ++i)
                      $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.encode(message.values[i], writer.uint32(
                        /* id 2, wireType 2 =*/
                        18
                      ).fork()).ldelim();
                  return writer;
                };
                PropertySet.encodeDelimited = function encodeDelimited(message, writer) {
                  return this.encode(message, writer).ldelim();
                };
                PropertySet.decode = function decode(reader, length) {
                  if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                  var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.PropertySet();
                  while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                      case 1:
                        if (!(message.keys && message.keys.length))
                          message.keys = [];
                        message.keys.push(reader.string());
                        break;
                      case 2:
                        if (!(message.values && message.values.length))
                          message.values = [];
                        message.values.push($root.org.eclipse.tahu.protobuf.Payload.PropertyValue.decode(reader, reader.uint32()));
                        break;
                      default:
                        reader.skipType(tag & 7);
                        break;
                    }
                  }
                  return message;
                };
                PropertySet.decodeDelimited = function decodeDelimited(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                PropertySet.verify = function verify(message) {
                  if (typeof message !== "object" || message === null)
                    return "object expected";
                  if (message.keys != null && message.hasOwnProperty("keys")) {
                    if (!Array.isArray(message.keys))
                      return "keys: array expected";
                    for (var i = 0; i < message.keys.length; ++i)
                      if (!$util.isString(message.keys[i]))
                        return "keys: string[] expected";
                  }
                  if (message.values != null && message.hasOwnProperty("values")) {
                    if (!Array.isArray(message.values))
                      return "values: array expected";
                    for (var i = 0; i < message.values.length; ++i) {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.verify(message.values[i]);
                      if (error)
                        return "values." + error;
                    }
                  }
                  return null;
                };
                PropertySet.fromObject = function fromObject(object) {
                  if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.PropertySet)
                    return object;
                  var message = new $root.org.eclipse.tahu.protobuf.Payload.PropertySet();
                  if (object.keys) {
                    if (!Array.isArray(object.keys))
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.PropertySet.keys: array expected");
                    message.keys = [];
                    for (var i = 0; i < object.keys.length; ++i)
                      message.keys[i] = String(object.keys[i]);
                  }
                  if (object.values) {
                    if (!Array.isArray(object.values))
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.PropertySet.values: array expected");
                    message.values = [];
                    for (var i = 0; i < object.values.length; ++i) {
                      if (typeof object.values[i] !== "object")
                        throw TypeError(".org.eclipse.tahu.protobuf.Payload.PropertySet.values: object expected");
                      message.values[i] = $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.fromObject(object.values[i]);
                    }
                  }
                  return message;
                };
                PropertySet.toObject = function toObject(message, options) {
                  if (!options)
                    options = {};
                  var object = {};
                  if (options.arrays || options.defaults) {
                    object.keys = [];
                    object.values = [];
                  }
                  if (message.keys && message.keys.length) {
                    object.keys = [];
                    for (var j = 0; j < message.keys.length; ++j)
                      object.keys[j] = message.keys[j];
                  }
                  if (message.values && message.values.length) {
                    object.values = [];
                    for (var j = 0; j < message.values.length; ++j)
                      object.values[j] = $root.org.eclipse.tahu.protobuf.Payload.PropertyValue.toObject(message.values[j], options);
                  }
                  return object;
                };
                PropertySet.prototype.toJSON = function toJSON() {
                  return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
                return PropertySet;
              })();
              Payload.PropertySetList = (function() {
                function PropertySetList(properties) {
                  this.propertyset = [];
                  if (properties) {
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
                  }
                }
                PropertySetList.prototype.propertyset = $util.emptyArray;
                PropertySetList.create = function create(properties) {
                  return new PropertySetList(properties);
                };
                PropertySetList.encode = function encode(message, writer) {
                  if (!writer)
                    writer = $Writer.create();
                  if (message.propertyset != null && message.propertyset.length)
                    for (var i = 0; i < message.propertyset.length; ++i)
                      $root.org.eclipse.tahu.protobuf.Payload.PropertySet.encode(message.propertyset[i], writer.uint32(
                        /* id 1, wireType 2 =*/
                        10
                      ).fork()).ldelim();
                  return writer;
                };
                PropertySetList.encodeDelimited = function encodeDelimited(message, writer) {
                  return this.encode(message, writer).ldelim();
                };
                PropertySetList.decode = function decode(reader, length) {
                  if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                  var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.PropertySetList();
                  while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                      case 1:
                        if (!(message.propertyset && message.propertyset.length))
                          message.propertyset = [];
                        message.propertyset.push($root.org.eclipse.tahu.protobuf.Payload.PropertySet.decode(reader, reader.uint32()));
                        break;
                      default:
                        reader.skipType(tag & 7);
                        break;
                    }
                  }
                  return message;
                };
                PropertySetList.decodeDelimited = function decodeDelimited(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                PropertySetList.verify = function verify(message) {
                  if (typeof message !== "object" || message === null)
                    return "object expected";
                  if (message.propertyset != null && message.hasOwnProperty("propertyset")) {
                    if (!Array.isArray(message.propertyset))
                      return "propertyset: array expected";
                    for (var i = 0; i < message.propertyset.length; ++i) {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.verify(message.propertyset[i]);
                      if (error)
                        return "propertyset." + error;
                    }
                  }
                  return null;
                };
                PropertySetList.fromObject = function fromObject(object) {
                  if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.PropertySetList)
                    return object;
                  var message = new $root.org.eclipse.tahu.protobuf.Payload.PropertySetList();
                  if (object.propertyset) {
                    if (!Array.isArray(object.propertyset))
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.PropertySetList.propertyset: array expected");
                    message.propertyset = [];
                    for (var i = 0; i < object.propertyset.length; ++i) {
                      if (typeof object.propertyset[i] !== "object")
                        throw TypeError(".org.eclipse.tahu.protobuf.Payload.PropertySetList.propertyset: object expected");
                      message.propertyset[i] = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.fromObject(object.propertyset[i]);
                    }
                  }
                  return message;
                };
                PropertySetList.toObject = function toObject(message, options) {
                  if (!options)
                    options = {};
                  var object = {};
                  if (options.arrays || options.defaults)
                    object.propertyset = [];
                  if (message.propertyset && message.propertyset.length) {
                    object.propertyset = [];
                    for (var j = 0; j < message.propertyset.length; ++j)
                      object.propertyset[j] = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.toObject(message.propertyset[j], options);
                  }
                  return object;
                };
                PropertySetList.prototype.toJSON = function toJSON() {
                  return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
                return PropertySetList;
              })();
              Payload.MetaData = (function() {
                function MetaData(properties) {
                  if (properties) {
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
                  }
                }
                MetaData.prototype.isMultiPart = false;
                MetaData.prototype.contentType = "";
                MetaData.prototype.size = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
                MetaData.prototype.seq = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
                MetaData.prototype.fileName = "";
                MetaData.prototype.fileType = "";
                MetaData.prototype.md5 = "";
                MetaData.prototype.description = "";
                MetaData.create = function create(properties) {
                  return new MetaData(properties);
                };
                MetaData.encode = function encode(message, writer) {
                  if (!writer)
                    writer = $Writer.create();
                  if (message.isMultiPart != null && Object.hasOwnProperty.call(message, "isMultiPart"))
                    writer.uint32(
                      /* id 1, wireType 0 =*/
                      8
                    ).bool(message.isMultiPart);
                  if (message.contentType != null && Object.hasOwnProperty.call(message, "contentType"))
                    writer.uint32(
                      /* id 2, wireType 2 =*/
                      18
                    ).string(message.contentType);
                  if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                    writer.uint32(
                      /* id 3, wireType 0 =*/
                      24
                    ).uint64(message.size);
                  if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
                    writer.uint32(
                      /* id 4, wireType 0 =*/
                      32
                    ).uint64(message.seq);
                  if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                    writer.uint32(
                      /* id 5, wireType 2 =*/
                      42
                    ).string(message.fileName);
                  if (message.fileType != null && Object.hasOwnProperty.call(message, "fileType"))
                    writer.uint32(
                      /* id 6, wireType 2 =*/
                      50
                    ).string(message.fileType);
                  if (message.md5 != null && Object.hasOwnProperty.call(message, "md5"))
                    writer.uint32(
                      /* id 7, wireType 2 =*/
                      58
                    ).string(message.md5);
                  if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                    writer.uint32(
                      /* id 8, wireType 2 =*/
                      66
                    ).string(message.description);
                  return writer;
                };
                MetaData.encodeDelimited = function encodeDelimited(message, writer) {
                  return this.encode(message, writer).ldelim();
                };
                MetaData.decode = function decode(reader, length) {
                  if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                  var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.MetaData();
                  while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                      case 1:
                        message.isMultiPart = reader.bool();
                        break;
                      case 2:
                        message.contentType = reader.string();
                        break;
                      case 3:
                        message.size = reader.uint64();
                        break;
                      case 4:
                        message.seq = reader.uint64();
                        break;
                      case 5:
                        message.fileName = reader.string();
                        break;
                      case 6:
                        message.fileType = reader.string();
                        break;
                      case 7:
                        message.md5 = reader.string();
                        break;
                      case 8:
                        message.description = reader.string();
                        break;
                      default:
                        reader.skipType(tag & 7);
                        break;
                    }
                  }
                  return message;
                };
                MetaData.decodeDelimited = function decodeDelimited(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                MetaData.verify = function verify(message) {
                  if (typeof message !== "object" || message === null)
                    return "object expected";
                  if (message.isMultiPart != null && message.hasOwnProperty("isMultiPart")) {
                    if (typeof message.isMultiPart !== "boolean")
                      return "isMultiPart: boolean expected";
                  }
                  if (message.contentType != null && message.hasOwnProperty("contentType")) {
                    if (!$util.isString(message.contentType))
                      return "contentType: string expected";
                  }
                  if (message.size != null && message.hasOwnProperty("size")) {
                    if (!$util.isInteger(message.size) && !(message.size && $util.isInteger(message.size.low) && $util.isInteger(message.size.high)))
                      return "size: integer|Long expected";
                  }
                  if (message.seq != null && message.hasOwnProperty("seq")) {
                    if (!$util.isInteger(message.seq) && !(message.seq && $util.isInteger(message.seq.low) && $util.isInteger(message.seq.high)))
                      return "seq: integer|Long expected";
                  }
                  if (message.fileName != null && message.hasOwnProperty("fileName")) {
                    if (!$util.isString(message.fileName))
                      return "fileName: string expected";
                  }
                  if (message.fileType != null && message.hasOwnProperty("fileType")) {
                    if (!$util.isString(message.fileType))
                      return "fileType: string expected";
                  }
                  if (message.md5 != null && message.hasOwnProperty("md5")) {
                    if (!$util.isString(message.md5))
                      return "md5: string expected";
                  }
                  if (message.description != null && message.hasOwnProperty("description")) {
                    if (!$util.isString(message.description))
                      return "description: string expected";
                  }
                  return null;
                };
                MetaData.fromObject = function fromObject(object) {
                  if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.MetaData)
                    return object;
                  var message = new $root.org.eclipse.tahu.protobuf.Payload.MetaData();
                  if (object.isMultiPart != null)
                    message.isMultiPart = Boolean(object.isMultiPart);
                  if (object.contentType != null)
                    message.contentType = String(object.contentType);
                  if (object.size != null) {
                    if ($util.Long)
                      (message.size = $util.Long.fromValue(object.size)).unsigned = true;
                    else if (typeof object.size === "string")
                      message.size = parseInt(object.size, 10);
                    else if (typeof object.size === "number")
                      message.size = object.size;
                    else if (typeof object.size === "object")
                      message.size = new $util.LongBits(object.size.low >>> 0, object.size.high >>> 0).toNumber(true);
                  }
                  if (object.seq != null) {
                    if ($util.Long)
                      (message.seq = $util.Long.fromValue(object.seq)).unsigned = true;
                    else if (typeof object.seq === "string")
                      message.seq = parseInt(object.seq, 10);
                    else if (typeof object.seq === "number")
                      message.seq = object.seq;
                    else if (typeof object.seq === "object")
                      message.seq = new $util.LongBits(object.seq.low >>> 0, object.seq.high >>> 0).toNumber(true);
                  }
                  if (object.fileName != null)
                    message.fileName = String(object.fileName);
                  if (object.fileType != null)
                    message.fileType = String(object.fileType);
                  if (object.md5 != null)
                    message.md5 = String(object.md5);
                  if (object.description != null)
                    message.description = String(object.description);
                  return message;
                };
                MetaData.toObject = function toObject(message, options) {
                  if (!options)
                    options = {};
                  var object = {};
                  if (options.defaults) {
                    object.isMultiPart = false;
                    object.contentType = "";
                    if ($util.Long) {
                      var long = new $util.Long(0, 0, true);
                      object.size = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                      object.size = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                      var long = new $util.Long(0, 0, true);
                      object.seq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                      object.seq = options.longs === String ? "0" : 0;
                    object.fileName = "";
                    object.fileType = "";
                    object.md5 = "";
                    object.description = "";
                  }
                  if (message.isMultiPart != null && message.hasOwnProperty("isMultiPart"))
                    object.isMultiPart = message.isMultiPart;
                  if (message.contentType != null && message.hasOwnProperty("contentType"))
                    object.contentType = message.contentType;
                  if (message.size != null && message.hasOwnProperty("size"))
                    if (typeof message.size === "number")
                      object.size = options.longs === String ? String(message.size) : message.size;
                    else
                      object.size = options.longs === String ? $util.Long.prototype.toString.call(message.size) : options.longs === Number ? new $util.LongBits(message.size.low >>> 0, message.size.high >>> 0).toNumber(true) : message.size;
                  if (message.seq != null && message.hasOwnProperty("seq"))
                    if (typeof message.seq === "number")
                      object.seq = options.longs === String ? String(message.seq) : message.seq;
                    else
                      object.seq = options.longs === String ? $util.Long.prototype.toString.call(message.seq) : options.longs === Number ? new $util.LongBits(message.seq.low >>> 0, message.seq.high >>> 0).toNumber(true) : message.seq;
                  if (message.fileName != null && message.hasOwnProperty("fileName"))
                    object.fileName = message.fileName;
                  if (message.fileType != null && message.hasOwnProperty("fileType"))
                    object.fileType = message.fileType;
                  if (message.md5 != null && message.hasOwnProperty("md5"))
                    object.md5 = message.md5;
                  if (message.description != null && message.hasOwnProperty("description"))
                    object.description = message.description;
                  return object;
                };
                MetaData.prototype.toJSON = function toJSON() {
                  return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
                return MetaData;
              })();
              Payload.Metric = (function() {
                function Metric(properties) {
                  if (properties) {
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
                  }
                }
                Metric.prototype.name = "";
                Metric.prototype.alias = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
                Metric.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
                Metric.prototype.datatype = 0;
                Metric.prototype.isHistorical = false;
                Metric.prototype.isTransient = false;
                Metric.prototype.isNull = false;
                Metric.prototype.metadata = null;
                Metric.prototype.properties = null;
                Metric.prototype.intValue = null;
                Metric.prototype.longValue = null;
                Metric.prototype.floatValue = null;
                Metric.prototype.doubleValue = null;
                Metric.prototype.booleanValue = null;
                Metric.prototype.stringValue = null;
                Metric.prototype.bytesValue = null;
                Metric.prototype.datasetValue = null;
                Metric.prototype.templateValue = null;
                Metric.prototype.extensionValue = null;
                var $oneOfFields;
                Object.defineProperty(Metric.prototype, "value", {
                  get: $util.oneOfGetter($oneOfFields = ["intValue", "longValue", "floatValue", "doubleValue", "booleanValue", "stringValue", "bytesValue", "datasetValue", "templateValue", "extensionValue"]),
                  set: $util.oneOfSetter($oneOfFields)
                });
                Metric.create = function create(properties) {
                  return new Metric(properties);
                };
                Metric.encode = function encode(message, writer) {
                  if (!writer)
                    writer = $Writer.create();
                  if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(
                      /* id 1, wireType 2 =*/
                      10
                    ).string(message.name);
                  if (message.alias != null && Object.hasOwnProperty.call(message, "alias"))
                    writer.uint32(
                      /* id 2, wireType 0 =*/
                      16
                    ).uint64(message.alias);
                  if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    writer.uint32(
                      /* id 3, wireType 0 =*/
                      24
                    ).uint64(message.timestamp);
                  if (message.datatype != null && Object.hasOwnProperty.call(message, "datatype"))
                    writer.uint32(
                      /* id 4, wireType 0 =*/
                      32
                    ).uint32(message.datatype);
                  if (message.isHistorical != null && Object.hasOwnProperty.call(message, "isHistorical"))
                    writer.uint32(
                      /* id 5, wireType 0 =*/
                      40
                    ).bool(message.isHistorical);
                  if (message.isTransient != null && Object.hasOwnProperty.call(message, "isTransient"))
                    writer.uint32(
                      /* id 6, wireType 0 =*/
                      48
                    ).bool(message.isTransient);
                  if (message.isNull != null && Object.hasOwnProperty.call(message, "isNull"))
                    writer.uint32(
                      /* id 7, wireType 0 =*/
                      56
                    ).bool(message.isNull);
                  if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                    $root.org.eclipse.tahu.protobuf.Payload.MetaData.encode(message.metadata, writer.uint32(
                      /* id 8, wireType 2 =*/
                      66
                    ).fork()).ldelim();
                  if (message.properties != null && Object.hasOwnProperty.call(message, "properties"))
                    $root.org.eclipse.tahu.protobuf.Payload.PropertySet.encode(message.properties, writer.uint32(
                      /* id 9, wireType 2 =*/
                      74
                    ).fork()).ldelim();
                  if (message.intValue != null && Object.hasOwnProperty.call(message, "intValue"))
                    writer.uint32(
                      /* id 10, wireType 0 =*/
                      80
                    ).uint32(message.intValue);
                  if (message.longValue != null && Object.hasOwnProperty.call(message, "longValue"))
                    writer.uint32(
                      /* id 11, wireType 0 =*/
                      88
                    ).uint64(message.longValue);
                  if (message.floatValue != null && Object.hasOwnProperty.call(message, "floatValue"))
                    writer.uint32(
                      /* id 12, wireType 5 =*/
                      101
                    ).float(message.floatValue);
                  if (message.doubleValue != null && Object.hasOwnProperty.call(message, "doubleValue"))
                    writer.uint32(
                      /* id 13, wireType 1 =*/
                      105
                    ).double(message.doubleValue);
                  if (message.booleanValue != null && Object.hasOwnProperty.call(message, "booleanValue"))
                    writer.uint32(
                      /* id 14, wireType 0 =*/
                      112
                    ).bool(message.booleanValue);
                  if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue"))
                    writer.uint32(
                      /* id 15, wireType 2 =*/
                      122
                    ).string(message.stringValue);
                  if (message.bytesValue != null && Object.hasOwnProperty.call(message, "bytesValue"))
                    writer.uint32(
                      /* id 16, wireType 2 =*/
                      130
                    ).bytes(message.bytesValue);
                  if (message.datasetValue != null && Object.hasOwnProperty.call(message, "datasetValue"))
                    $root.org.eclipse.tahu.protobuf.Payload.DataSet.encode(message.datasetValue, writer.uint32(
                      /* id 17, wireType 2 =*/
                      138
                    ).fork()).ldelim();
                  if (message.templateValue != null && Object.hasOwnProperty.call(message, "templateValue"))
                    $root.org.eclipse.tahu.protobuf.Payload.Template.encode(message.templateValue, writer.uint32(
                      /* id 18, wireType 2 =*/
                      146
                    ).fork()).ldelim();
                  if (message.extensionValue != null && Object.hasOwnProperty.call(message, "extensionValue"))
                    $root.org.eclipse.tahu.protobuf.Payload.Metric.MetricValueExtension.encode(message.extensionValue, writer.uint32(
                      /* id 19, wireType 2 =*/
                      154
                    ).fork()).ldelim();
                  return writer;
                };
                Metric.encodeDelimited = function encodeDelimited(message, writer) {
                  return this.encode(message, writer).ldelim();
                };
                Metric.decode = function decode(reader, length) {
                  if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                  var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.Metric();
                  while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                      case 1:
                        message.name = reader.string();
                        break;
                      case 2:
                        message.alias = reader.uint64();
                        break;
                      case 3:
                        message.timestamp = reader.uint64();
                        break;
                      case 4:
                        message.datatype = reader.uint32();
                        break;
                      case 5:
                        message.isHistorical = reader.bool();
                        break;
                      case 6:
                        message.isTransient = reader.bool();
                        break;
                      case 7:
                        message.isNull = reader.bool();
                        break;
                      case 8:
                        message.metadata = $root.org.eclipse.tahu.protobuf.Payload.MetaData.decode(reader, reader.uint32());
                        break;
                      case 9:
                        message.properties = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.decode(reader, reader.uint32());
                        break;
                      case 10:
                        message.intValue = reader.uint32();
                        break;
                      case 11:
                        message.longValue = reader.uint64();
                        break;
                      case 12:
                        message.floatValue = reader.float();
                        break;
                      case 13:
                        message.doubleValue = reader.double();
                        break;
                      case 14:
                        message.booleanValue = reader.bool();
                        break;
                      case 15:
                        message.stringValue = reader.string();
                        break;
                      case 16:
                        message.bytesValue = reader.bytes();
                        break;
                      case 17:
                        message.datasetValue = $root.org.eclipse.tahu.protobuf.Payload.DataSet.decode(reader, reader.uint32());
                        break;
                      case 18:
                        message.templateValue = $root.org.eclipse.tahu.protobuf.Payload.Template.decode(reader, reader.uint32());
                        break;
                      case 19:
                        message.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.Metric.MetricValueExtension.decode(reader, reader.uint32());
                        break;
                      default:
                        reader.skipType(tag & 7);
                        break;
                    }
                  }
                  return message;
                };
                Metric.decodeDelimited = function decodeDelimited(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                Metric.verify = function verify(message) {
                  if (typeof message !== "object" || message === null)
                    return "object expected";
                  var properties = {};
                  if (message.name != null && message.hasOwnProperty("name")) {
                    if (!$util.isString(message.name))
                      return "name: string expected";
                  }
                  if (message.alias != null && message.hasOwnProperty("alias")) {
                    if (!$util.isInteger(message.alias) && !(message.alias && $util.isInteger(message.alias.low) && $util.isInteger(message.alias.high)))
                      return "alias: integer|Long expected";
                  }
                  if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
                    if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                      return "timestamp: integer|Long expected";
                  }
                  if (message.datatype != null && message.hasOwnProperty("datatype")) {
                    if (!$util.isInteger(message.datatype))
                      return "datatype: integer expected";
                  }
                  if (message.isHistorical != null && message.hasOwnProperty("isHistorical")) {
                    if (typeof message.isHistorical !== "boolean")
                      return "isHistorical: boolean expected";
                  }
                  if (message.isTransient != null && message.hasOwnProperty("isTransient")) {
                    if (typeof message.isTransient !== "boolean")
                      return "isTransient: boolean expected";
                  }
                  if (message.isNull != null && message.hasOwnProperty("isNull")) {
                    if (typeof message.isNull !== "boolean")
                      return "isNull: boolean expected";
                  }
                  if (message.metadata != null && message.hasOwnProperty("metadata")) {
                    var error = $root.org.eclipse.tahu.protobuf.Payload.MetaData.verify(message.metadata);
                    if (error)
                      return "metadata." + error;
                  }
                  if (message.properties != null && message.hasOwnProperty("properties")) {
                    var error = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.verify(message.properties);
                    if (error)
                      return "properties." + error;
                  }
                  if (message.intValue != null && message.hasOwnProperty("intValue")) {
                    properties.value = 1;
                    if (!$util.isInteger(message.intValue))
                      return "intValue: integer expected";
                  }
                  if (message.longValue != null && message.hasOwnProperty("longValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (!$util.isInteger(message.longValue) && !(message.longValue && $util.isInteger(message.longValue.low) && $util.isInteger(message.longValue.high)))
                      return "longValue: integer|Long expected";
                  }
                  if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (typeof message.floatValue !== "number")
                      return "floatValue: number expected";
                  }
                  if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (typeof message.doubleValue !== "number")
                      return "doubleValue: number expected";
                  }
                  if (message.booleanValue != null && message.hasOwnProperty("booleanValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (typeof message.booleanValue !== "boolean")
                      return "booleanValue: boolean expected";
                  }
                  if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (!$util.isString(message.stringValue))
                      return "stringValue: string expected";
                  }
                  if (message.bytesValue != null && message.hasOwnProperty("bytesValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    if (!(message.bytesValue && typeof message.bytesValue.length === "number" || $util.isString(message.bytesValue)))
                      return "bytesValue: buffer expected";
                  }
                  if (message.datasetValue != null && message.hasOwnProperty("datasetValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.DataSet.verify(message.datasetValue);
                      if (error)
                        return "datasetValue." + error;
                    }
                  }
                  if (message.templateValue != null && message.hasOwnProperty("templateValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.Template.verify(message.templateValue);
                      if (error)
                        return "templateValue." + error;
                    }
                  }
                  if (message.extensionValue != null && message.hasOwnProperty("extensionValue")) {
                    if (properties.value === 1)
                      return "value: multiple values";
                    properties.value = 1;
                    {
                      var error = $root.org.eclipse.tahu.protobuf.Payload.Metric.MetricValueExtension.verify(message.extensionValue);
                      if (error)
                        return "extensionValue." + error;
                    }
                  }
                  return null;
                };
                Metric.fromObject = function fromObject(object) {
                  if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.Metric)
                    return object;
                  var message = new $root.org.eclipse.tahu.protobuf.Payload.Metric();
                  if (object.name != null)
                    message.name = String(object.name);
                  if (object.alias != null) {
                    if ($util.Long)
                      (message.alias = $util.Long.fromValue(object.alias)).unsigned = true;
                    else if (typeof object.alias === "string")
                      message.alias = parseInt(object.alias, 10);
                    else if (typeof object.alias === "number")
                      message.alias = object.alias;
                    else if (typeof object.alias === "object")
                      message.alias = new $util.LongBits(object.alias.low >>> 0, object.alias.high >>> 0).toNumber(true);
                  }
                  if (object.timestamp != null) {
                    if ($util.Long)
                      (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                    else if (typeof object.timestamp === "string")
                      message.timestamp = parseInt(object.timestamp, 10);
                    else if (typeof object.timestamp === "number")
                      message.timestamp = object.timestamp;
                    else if (typeof object.timestamp === "object")
                      message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
                  }
                  if (object.datatype != null)
                    message.datatype = object.datatype >>> 0;
                  if (object.isHistorical != null)
                    message.isHistorical = Boolean(object.isHistorical);
                  if (object.isTransient != null)
                    message.isTransient = Boolean(object.isTransient);
                  if (object.isNull != null)
                    message.isNull = Boolean(object.isNull);
                  if (object.metadata != null) {
                    if (typeof object.metadata !== "object")
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.Metric.metadata: object expected");
                    message.metadata = $root.org.eclipse.tahu.protobuf.Payload.MetaData.fromObject(object.metadata);
                  }
                  if (object.properties != null) {
                    if (typeof object.properties !== "object")
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.Metric.properties: object expected");
                    message.properties = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.fromObject(object.properties);
                  }
                  if (object.intValue != null)
                    message.intValue = object.intValue >>> 0;
                  if (object.longValue != null) {
                    if ($util.Long)
                      (message.longValue = $util.Long.fromValue(object.longValue)).unsigned = true;
                    else if (typeof object.longValue === "string")
                      message.longValue = parseInt(object.longValue, 10);
                    else if (typeof object.longValue === "number")
                      message.longValue = object.longValue;
                    else if (typeof object.longValue === "object")
                      message.longValue = new $util.LongBits(object.longValue.low >>> 0, object.longValue.high >>> 0).toNumber(true);
                  }
                  if (object.floatValue != null)
                    message.floatValue = Number(object.floatValue);
                  if (object.doubleValue != null)
                    message.doubleValue = Number(object.doubleValue);
                  if (object.booleanValue != null)
                    message.booleanValue = Boolean(object.booleanValue);
                  if (object.stringValue != null)
                    message.stringValue = String(object.stringValue);
                  if (object.bytesValue != null) {
                    if (typeof object.bytesValue === "string")
                      $util.base64.decode(object.bytesValue, message.bytesValue = $util.newBuffer($util.base64.length(object.bytesValue)), 0);
                    else if (object.bytesValue.length)
                      message.bytesValue = object.bytesValue;
                  }
                  if (object.datasetValue != null) {
                    if (typeof object.datasetValue !== "object")
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.Metric.datasetValue: object expected");
                    message.datasetValue = $root.org.eclipse.tahu.protobuf.Payload.DataSet.fromObject(object.datasetValue);
                  }
                  if (object.templateValue != null) {
                    if (typeof object.templateValue !== "object")
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.Metric.templateValue: object expected");
                    message.templateValue = $root.org.eclipse.tahu.protobuf.Payload.Template.fromObject(object.templateValue);
                  }
                  if (object.extensionValue != null) {
                    if (typeof object.extensionValue !== "object")
                      throw TypeError(".org.eclipse.tahu.protobuf.Payload.Metric.extensionValue: object expected");
                    message.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.Metric.MetricValueExtension.fromObject(object.extensionValue);
                  }
                  return message;
                };
                Metric.toObject = function toObject(message, options) {
                  if (!options)
                    options = {};
                  var object = {};
                  if (options.defaults) {
                    object.name = "";
                    if ($util.Long) {
                      var long = new $util.Long(0, 0, true);
                      object.alias = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                      object.alias = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                      var long = new $util.Long(0, 0, true);
                      object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                      object.timestamp = options.longs === String ? "0" : 0;
                    object.datatype = 0;
                    object.isHistorical = false;
                    object.isTransient = false;
                    object.isNull = false;
                    object.metadata = null;
                    object.properties = null;
                  }
                  if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                  if (message.alias != null && message.hasOwnProperty("alias"))
                    if (typeof message.alias === "number")
                      object.alias = options.longs === String ? String(message.alias) : message.alias;
                    else
                      object.alias = options.longs === String ? $util.Long.prototype.toString.call(message.alias) : options.longs === Number ? new $util.LongBits(message.alias.low >>> 0, message.alias.high >>> 0).toNumber(true) : message.alias;
                  if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (typeof message.timestamp === "number")
                      object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                    else
                      object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
                  if (message.datatype != null && message.hasOwnProperty("datatype"))
                    object.datatype = message.datatype;
                  if (message.isHistorical != null && message.hasOwnProperty("isHistorical"))
                    object.isHistorical = message.isHistorical;
                  if (message.isTransient != null && message.hasOwnProperty("isTransient"))
                    object.isTransient = message.isTransient;
                  if (message.isNull != null && message.hasOwnProperty("isNull"))
                    object.isNull = message.isNull;
                  if (message.metadata != null && message.hasOwnProperty("metadata"))
                    object.metadata = $root.org.eclipse.tahu.protobuf.Payload.MetaData.toObject(message.metadata, options);
                  if (message.properties != null && message.hasOwnProperty("properties"))
                    object.properties = $root.org.eclipse.tahu.protobuf.Payload.PropertySet.toObject(message.properties, options);
                  if (message.intValue != null && message.hasOwnProperty("intValue")) {
                    object.intValue = message.intValue;
                    if (options.oneofs)
                      object.value = "intValue";
                  }
                  if (message.longValue != null && message.hasOwnProperty("longValue")) {
                    if (typeof message.longValue === "number")
                      object.longValue = options.longs === String ? String(message.longValue) : message.longValue;
                    else
                      object.longValue = options.longs === String ? $util.Long.prototype.toString.call(message.longValue) : options.longs === Number ? new $util.LongBits(message.longValue.low >>> 0, message.longValue.high >>> 0).toNumber(true) : message.longValue;
                    if (options.oneofs)
                      object.value = "longValue";
                  }
                  if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                    object.floatValue = options.json && !isFinite(message.floatValue) ? String(message.floatValue) : message.floatValue;
                    if (options.oneofs)
                      object.value = "floatValue";
                  }
                  if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                    object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
                    if (options.oneofs)
                      object.value = "doubleValue";
                  }
                  if (message.booleanValue != null && message.hasOwnProperty("booleanValue")) {
                    object.booleanValue = message.booleanValue;
                    if (options.oneofs)
                      object.value = "booleanValue";
                  }
                  if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    object.stringValue = message.stringValue;
                    if (options.oneofs)
                      object.value = "stringValue";
                  }
                  if (message.bytesValue != null && message.hasOwnProperty("bytesValue")) {
                    object.bytesValue = options.bytes === String ? $util.base64.encode(message.bytesValue, 0, message.bytesValue.length) : options.bytes === Array ? Array.prototype.slice.call(message.bytesValue) : message.bytesValue;
                    if (options.oneofs)
                      object.value = "bytesValue";
                  }
                  if (message.datasetValue != null && message.hasOwnProperty("datasetValue")) {
                    object.datasetValue = $root.org.eclipse.tahu.protobuf.Payload.DataSet.toObject(message.datasetValue, options);
                    if (options.oneofs)
                      object.value = "datasetValue";
                  }
                  if (message.templateValue != null && message.hasOwnProperty("templateValue")) {
                    object.templateValue = $root.org.eclipse.tahu.protobuf.Payload.Template.toObject(message.templateValue, options);
                    if (options.oneofs)
                      object.value = "templateValue";
                  }
                  if (message.extensionValue != null && message.hasOwnProperty("extensionValue")) {
                    object.extensionValue = $root.org.eclipse.tahu.protobuf.Payload.Metric.MetricValueExtension.toObject(message.extensionValue, options);
                    if (options.oneofs)
                      object.value = "extensionValue";
                  }
                  return object;
                };
                Metric.prototype.toJSON = function toJSON() {
                  return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
                Metric.MetricValueExtension = (function() {
                  function MetricValueExtension(properties) {
                    if (properties) {
                      for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                          this[keys[i]] = properties[keys[i]];
                    }
                  }
                  MetricValueExtension.create = function create(properties) {
                    return new MetricValueExtension(properties);
                  };
                  MetricValueExtension.encode = function encode(message, writer) {
                    if (!writer)
                      writer = $Writer.create();
                    return writer;
                  };
                  MetricValueExtension.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                  };
                  MetricValueExtension.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                      reader = $Reader.create(reader);
                    var end = length === void 0 ? reader.len : reader.pos + length, message = new $root.org.eclipse.tahu.protobuf.Payload.Metric.MetricValueExtension();
                    while (reader.pos < end) {
                      var tag = reader.uint32();
                      switch (tag >>> 3) {
                        default:
                          reader.skipType(tag & 7);
                          break;
                      }
                    }
                    return message;
                  };
                  MetricValueExtension.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                      reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                  };
                  MetricValueExtension.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                      return "object expected";
                    return null;
                  };
                  MetricValueExtension.fromObject = function fromObject(object) {
                    if (object instanceof $root.org.eclipse.tahu.protobuf.Payload.Metric.MetricValueExtension)
                      return object;
                    return new $root.org.eclipse.tahu.protobuf.Payload.Metric.MetricValueExtension();
                  };
                  MetricValueExtension.toObject = function toObject() {
                    return {};
                  };
                  MetricValueExtension.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                  };
                  return MetricValueExtension;
                })();
                return Metric;
              })();
              return Payload;
            })();
            return protobuf;
          })();
          return tahu;
        })();
        return eclipse;
      })();
      return org;
    })();
    module2.exports = $root;
  }
});

// node_modules/long/src/long.js
var require_long = __commonJS({
  "node_modules/long/src/long.js"(exports2, module2) {
    module2.exports = Long;
    var wasm = null;
    try {
      wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
        0,
        97,
        115,
        109,
        1,
        0,
        0,
        0,
        1,
        13,
        2,
        96,
        0,
        1,
        127,
        96,
        4,
        127,
        127,
        127,
        127,
        1,
        127,
        3,
        7,
        6,
        0,
        1,
        1,
        1,
        1,
        1,
        6,
        6,
        1,
        127,
        1,
        65,
        0,
        11,
        7,
        50,
        6,
        3,
        109,
        117,
        108,
        0,
        1,
        5,
        100,
        105,
        118,
        95,
        115,
        0,
        2,
        5,
        100,
        105,
        118,
        95,
        117,
        0,
        3,
        5,
        114,
        101,
        109,
        95,
        115,
        0,
        4,
        5,
        114,
        101,
        109,
        95,
        117,
        0,
        5,
        8,
        103,
        101,
        116,
        95,
        104,
        105,
        103,
        104,
        0,
        0,
        10,
        191,
        1,
        6,
        4,
        0,
        35,
        0,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        126,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        127,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        128,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        129,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        130,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11
      ])), {}).exports;
    } catch (e) {
    }
    function Long(low, high, unsigned) {
      this.low = low | 0;
      this.high = high | 0;
      this.unsigned = !!unsigned;
    }
    Long.prototype.__isLong__;
    Object.defineProperty(Long.prototype, "__isLong__", { value: true });
    function isLong(obj) {
      return (obj && obj["__isLong__"]) === true;
    }
    Long.isLong = isLong;
    var INT_CACHE = {};
    var UINT_CACHE = {};
    function fromInt(value, unsigned) {
      var obj, cachedObj, cache;
      if (unsigned) {
        value >>>= 0;
        if (cache = 0 <= value && value < 256) {
          cachedObj = UINT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
          UINT_CACHE[value] = obj;
        return obj;
      } else {
        value |= 0;
        if (cache = -128 <= value && value < 128) {
          cachedObj = INT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
          INT_CACHE[value] = obj;
        return obj;
      }
    }
    Long.fromInt = fromInt;
    function fromNumber(value, unsigned) {
      if (isNaN(value))
        return unsigned ? UZERO : ZERO;
      if (unsigned) {
        if (value < 0)
          return UZERO;
        if (value >= TWO_PWR_64_DBL)
          return MAX_UNSIGNED_VALUE;
      } else {
        if (value <= -TWO_PWR_63_DBL)
          return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
          return MAX_VALUE;
      }
      if (value < 0)
        return fromNumber(-value, unsigned).neg();
      return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
    }
    Long.fromNumber = fromNumber;
    function fromBits(lowBits, highBits, unsigned) {
      return new Long(lowBits, highBits, unsigned);
    }
    Long.fromBits = fromBits;
    var pow_dbl = Math.pow;
    function fromString(str, unsigned, radix) {
      if (str.length === 0)
        throw Error("empty string");
      if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
      if (typeof unsigned === "number") {
        radix = unsigned, unsigned = false;
      } else {
        unsigned = !!unsigned;
      }
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      var p;
      if ((p = str.indexOf("-")) > 0)
        throw Error("interior hyphen");
      else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
      }
      var radixToPower = fromNumber(pow_dbl(radix, 8));
      var result = ZERO;
      for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
          var power = fromNumber(pow_dbl(radix, size));
          result = result.mul(power).add(fromNumber(value));
        } else {
          result = result.mul(radixToPower);
          result = result.add(fromNumber(value));
        }
      }
      result.unsigned = unsigned;
      return result;
    }
    Long.fromString = fromString;
    function fromValue(val, unsigned) {
      if (typeof val === "number")
        return fromNumber(val, unsigned);
      if (typeof val === "string")
        return fromString(val, unsigned);
      return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
    }
    Long.fromValue = fromValue;
    var TWO_PWR_16_DBL = 1 << 16;
    var TWO_PWR_24_DBL = 1 << 24;
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
    var ZERO = fromInt(0);
    Long.ZERO = ZERO;
    var UZERO = fromInt(0, true);
    Long.UZERO = UZERO;
    var ONE = fromInt(1);
    Long.ONE = ONE;
    var UONE = fromInt(1, true);
    Long.UONE = UONE;
    var NEG_ONE = fromInt(-1);
    Long.NEG_ONE = NEG_ONE;
    var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
    Long.MAX_VALUE = MAX_VALUE;
    var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
    var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
    Long.MIN_VALUE = MIN_VALUE;
    var LongPrototype = Long.prototype;
    LongPrototype.toInt = function toInt() {
      return this.unsigned ? this.low >>> 0 : this.low;
    };
    LongPrototype.toNumber = function toNumber() {
      if (this.unsigned)
        return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
      return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };
    LongPrototype.toString = function toString(radix) {
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      if (this.isZero())
        return "0";
      if (this.isNegative()) {
        if (this.eq(MIN_VALUE)) {
          var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
          return div.toString(radix) + rem1.toInt().toString(radix);
        } else
          return "-" + this.neg().toString(radix);
      }
      var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
      var result = "";
      while (true) {
        var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
          return digits + result;
        else {
          while (digits.length < 6)
            digits = "0" + digits;
          result = "" + digits + result;
        }
      }
    };
    LongPrototype.getHighBits = function getHighBits() {
      return this.high;
    };
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
      return this.high >>> 0;
    };
    LongPrototype.getLowBits = function getLowBits() {
      return this.low;
    };
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
      return this.low >>> 0;
    };
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
      if (this.isNegative())
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
      var val = this.high != 0 ? this.high : this.low;
      for (var bit = 31; bit > 0; bit--)
        if ((val & 1 << bit) != 0)
          break;
      return this.high != 0 ? bit + 33 : bit + 1;
    };
    LongPrototype.isZero = function isZero() {
      return this.high === 0 && this.low === 0;
    };
    LongPrototype.eqz = LongPrototype.isZero;
    LongPrototype.isNegative = function isNegative() {
      return !this.unsigned && this.high < 0;
    };
    LongPrototype.isPositive = function isPositive() {
      return this.unsigned || this.high >= 0;
    };
    LongPrototype.isOdd = function isOdd() {
      return (this.low & 1) === 1;
    };
    LongPrototype.isEven = function isEven() {
      return (this.low & 1) === 0;
    };
    LongPrototype.equals = function equals(other) {
      if (!isLong(other))
        other = fromValue(other);
      if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
        return false;
      return this.high === other.high && this.low === other.low;
    };
    LongPrototype.eq = LongPrototype.equals;
    LongPrototype.notEquals = function notEquals(other) {
      return !this.eq(
        /* validates */
        other
      );
    };
    LongPrototype.neq = LongPrototype.notEquals;
    LongPrototype.ne = LongPrototype.notEquals;
    LongPrototype.lessThan = function lessThan(other) {
      return this.comp(
        /* validates */
        other
      ) < 0;
    };
    LongPrototype.lt = LongPrototype.lessThan;
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
      return this.comp(
        /* validates */
        other
      ) <= 0;
    };
    LongPrototype.lte = LongPrototype.lessThanOrEqual;
    LongPrototype.le = LongPrototype.lessThanOrEqual;
    LongPrototype.greaterThan = function greaterThan(other) {
      return this.comp(
        /* validates */
        other
      ) > 0;
    };
    LongPrototype.gt = LongPrototype.greaterThan;
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
      return this.comp(
        /* validates */
        other
      ) >= 0;
    };
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;
    LongPrototype.ge = LongPrototype.greaterThanOrEqual;
    LongPrototype.compare = function compare(other) {
      if (!isLong(other))
        other = fromValue(other);
      if (this.eq(other))
        return 0;
      var thisNeg = this.isNegative(), otherNeg = other.isNegative();
      if (thisNeg && !otherNeg)
        return -1;
      if (!thisNeg && otherNeg)
        return 1;
      if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
      return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
    };
    LongPrototype.comp = LongPrototype.compare;
    LongPrototype.negate = function negate() {
      if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
      return this.not().add(ONE);
    };
    LongPrototype.neg = LongPrototype.negate;
    LongPrototype.add = function add(addend) {
      if (!isLong(addend))
        addend = fromValue(addend);
      var a48 = this.high >>> 16;
      var a32 = this.high & 65535;
      var a16 = this.low >>> 16;
      var a00 = this.low & 65535;
      var b48 = addend.high >>> 16;
      var b32 = addend.high & 65535;
      var b16 = addend.low >>> 16;
      var b00 = addend.low & 65535;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 + b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 + b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 + b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 + b48;
      c48 &= 65535;
      return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    LongPrototype.subtract = function subtract(subtrahend) {
      if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
      return this.add(subtrahend.neg());
    };
    LongPrototype.sub = LongPrototype.subtract;
    LongPrototype.multiply = function multiply(multiplier) {
      if (this.isZero())
        return ZERO;
      if (!isLong(multiplier))
        multiplier = fromValue(multiplier);
      if (wasm) {
        var low = wasm.mul(
          this.low,
          this.high,
          multiplier.low,
          multiplier.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      if (multiplier.isZero())
        return ZERO;
      if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
      if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;
      if (this.isNegative()) {
        if (multiplier.isNegative())
          return this.neg().mul(multiplier.neg());
        else
          return this.neg().mul(multiplier).neg();
      } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();
      if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
      var a48 = this.high >>> 16;
      var a32 = this.high & 65535;
      var a16 = this.low >>> 16;
      var a00 = this.low & 65535;
      var b48 = multiplier.high >>> 16;
      var b32 = multiplier.high & 65535;
      var b16 = multiplier.low >>> 16;
      var b00 = multiplier.low & 65535;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 * b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 * b00;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c16 += a00 * b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 * b00;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a16 * b16;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a00 * b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
      c48 &= 65535;
      return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    LongPrototype.mul = LongPrototype.multiply;
    LongPrototype.divide = function divide(divisor) {
      if (!isLong(divisor))
        divisor = fromValue(divisor);
      if (divisor.isZero())
        throw Error("division by zero");
      if (wasm) {
        if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
          return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
          this.low,
          this.high,
          divisor.low,
          divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
      var approx, rem, res;
      if (!this.unsigned) {
        if (this.eq(MIN_VALUE)) {
          if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
            return MIN_VALUE;
          else if (divisor.eq(MIN_VALUE))
            return ONE;
          else {
            var halfThis = this.shr(1);
            approx = halfThis.div(divisor).shl(1);
            if (approx.eq(ZERO)) {
              return divisor.isNegative() ? ONE : NEG_ONE;
            } else {
              rem = this.sub(divisor.mul(approx));
              res = approx.add(rem.div(divisor));
              return res;
            }
          }
        } else if (divisor.eq(MIN_VALUE))
          return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
          if (divisor.isNegative())
            return this.neg().div(divisor.neg());
          return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
          return this.div(divisor.neg()).neg();
        res = ZERO;
      } else {
        if (!divisor.unsigned)
          divisor = divisor.toUnsigned();
        if (divisor.gt(this))
          return UZERO;
        if (divisor.gt(this.shru(1)))
          return UONE;
        res = UZERO;
      }
      rem = this;
      while (rem.gte(divisor)) {
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
        var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
          approx -= delta;
          approxRes = fromNumber(approx, this.unsigned);
          approxRem = approxRes.mul(divisor);
        }
        if (approxRes.isZero())
          approxRes = ONE;
        res = res.add(approxRes);
        rem = rem.sub(approxRem);
      }
      return res;
    };
    LongPrototype.div = LongPrototype.divide;
    LongPrototype.modulo = function modulo(divisor) {
      if (!isLong(divisor))
        divisor = fromValue(divisor);
      if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
          this.low,
          this.high,
          divisor.low,
          divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      return this.sub(this.div(divisor).mul(divisor));
    };
    LongPrototype.mod = LongPrototype.modulo;
    LongPrototype.rem = LongPrototype.modulo;
    LongPrototype.not = function not() {
      return fromBits(~this.low, ~this.high, this.unsigned);
    };
    LongPrototype.and = function and(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };
    LongPrototype.or = function or(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };
    LongPrototype.xor = function xor(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
      else
        return fromBits(0, this.low << numBits - 32, this.unsigned);
    };
    LongPrototype.shl = LongPrototype.shiftLeft;
    LongPrototype.shiftRight = function shiftRight(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
      else
        return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
    };
    LongPrototype.shr = LongPrototype.shiftRight;
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      numBits &= 63;
      if (numBits === 0)
        return this;
      else {
        var high = this.high;
        if (numBits < 32) {
          var low = this.low;
          return fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits, this.unsigned);
        } else if (numBits === 32)
          return fromBits(high, 0, this.unsigned);
        else
          return fromBits(high >>> numBits - 32, 0, this.unsigned);
      }
    };
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;
    LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
    LongPrototype.toSigned = function toSigned() {
      if (!this.unsigned)
        return this;
      return fromBits(this.low, this.high, false);
    };
    LongPrototype.toUnsigned = function toUnsigned() {
      if (this.unsigned)
        return this;
      return fromBits(this.low, this.high, true);
    };
    LongPrototype.toBytes = function toBytes(le) {
      return le ? this.toBytesLE() : this.toBytesBE();
    };
    LongPrototype.toBytesLE = function toBytesLE() {
      var hi = this.high, lo = this.low;
      return [
        lo & 255,
        lo >>> 8 & 255,
        lo >>> 16 & 255,
        lo >>> 24,
        hi & 255,
        hi >>> 8 & 255,
        hi >>> 16 & 255,
        hi >>> 24
      ];
    };
    LongPrototype.toBytesBE = function toBytesBE() {
      var hi = this.high, lo = this.low;
      return [
        hi >>> 24,
        hi >>> 16 & 255,
        hi >>> 8 & 255,
        hi & 255,
        lo >>> 24,
        lo >>> 16 & 255,
        lo >>> 8 & 255,
        lo & 255
      ];
    };
    Long.fromBytes = function fromBytes(bytes2, unsigned, le) {
      return le ? Long.fromBytesLE(bytes2, unsigned) : Long.fromBytesBE(bytes2, unsigned);
    };
    Long.fromBytesLE = function fromBytesLE(bytes2, unsigned) {
      return new Long(
        bytes2[0] | bytes2[1] << 8 | bytes2[2] << 16 | bytes2[3] << 24,
        bytes2[4] | bytes2[5] << 8 | bytes2[6] << 16 | bytes2[7] << 24,
        unsigned
      );
    };
    Long.fromBytesBE = function fromBytesBE(bytes2, unsigned) {
      return new Long(
        bytes2[4] << 24 | bytes2[5] << 16 | bytes2[6] << 8 | bytes2[7],
        bytes2[0] << 24 | bytes2[1] << 16 | bytes2[2] << 8 | bytes2[3],
        unsigned
      );
    };
  }
});

// node_modules/sparkplug-payload/lib/sparkplugbpayload.js
var require_sparkplugbpayload = __commonJS({
  "node_modules/sparkplug-payload/lib/sparkplugbpayload.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod2) {
      if (mod2 && mod2.__esModule) return mod2;
      var result = {};
      if (mod2 != null) {
        for (var k in mod2) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k)) __createBinding(result, mod2, k);
      }
      __setModuleDefault(result, mod2);
      return result;
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod2) {
      return mod2 && mod2.__esModule ? mod2 : { "default": mod2 };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.decodePayload = exports2.encodePayload = void 0;
    var ProtoRoot = __importStar(require_sparkplugPayloadProto());
    var long_1 = __importDefault(require_long());
    var Payload = ProtoRoot.org.eclipse.tahu.protobuf.Payload;
    var Template = Payload.Template;
    var Parameter = Template.Parameter;
    var DataSet = Payload.DataSet;
    var DataSetValue = DataSet.DataSetValue;
    var Row = DataSet.Row;
    var PropertyValue = Payload.PropertyValue;
    var PropertySet = Payload.PropertySet;
    var PropertySetList = Payload.PropertySetList;
    var MetaData = Payload.MetaData;
    var Metric = Payload.Metric;
    function setValue(type, value, object) {
      switch (type) {
        case 1:
        // Int8
        case 2:
        // Int16
        case 3:
        // Int32
        case 5:
        // UInt8
        case 6:
          object.intValue = value;
          break;
        case 4:
        // Int64
        case 7:
        // UInt32
        case 8:
        // UInt64
        case 13:
          object.longValue = value;
          break;
        case 9:
          object.floatValue = value;
          break;
        case 10:
          object.doubleValue = value;
          break;
        case 11:
          object.booleanValue = value;
          break;
        case 12:
        // String
        case 14:
        // Text
        case 15:
          object.stringValue = value;
          break;
        case 16:
          object.datasetValue = encodeDataSet(value);
          break;
        case 17:
        // Bytes
        case 18:
          object.bytesValue = value;
          break;
        case 19:
          object.templateValue = encodeTemplate(value);
          break;
        case 20:
          object.propertysetValue = encodePropertySet(value);
          break;
        case 21:
          object.propertysetsValue = encodePropertySetList(value);
          break;
      }
    }
    function getValue(type, object) {
      switch (type) {
        case 1:
        // Int8
        case 2:
        // Int16
        case 3:
          return new Int32Array([object.intValue])[0];
        case 5:
        // UInt8
        case 6:
          return object.intValue;
        case 4:
          if (object.longValue instanceof long_1.default) {
            return object.longValue.toSigned();
          } else {
            return object.longValue;
          }
        case 7:
          if (object.longValue instanceof long_1.default) {
            return object.longValue.toInt();
          } else {
            return object.longValue;
          }
        case 8:
        // UInt64
        case 13:
          return object.longValue;
        case 9:
          return object.floatValue;
        case 10:
          return object.doubleValue;
        case 11:
          return object.booleanValue;
        case 12:
        // String
        case 14:
        // Text
        case 15:
          return object.stringValue;
        case 16:
          return decodeDataSet(object.datasetValue);
        case 17:
        // Bytes
        case 18:
          return object.bytesValue;
        case 19:
          return decodeTemplate(object.templateValue);
        case 20:
          return decodePropertySet(object.propertysetValue);
        case 21:
          return decodePropertySetList(object.propertysetsValue);
        default:
          return null;
      }
    }
    function isSet(value) {
      return value !== null && value !== void 0;
    }
    function getDataSetValue(type, object) {
      switch (type) {
        case 7:
          if (object.longValue instanceof long_1.default)
            return object.longValue.toInt();
          else if (isSet(object.longValue))
            return object.longValue;
        case 4:
          if (isSet(object.longValue))
            return object.longValue;
        case 9:
          if (isSet(object.floatValue))
            return object.floatValue;
        case 10:
          if (isSet(object.doubleValue))
            return object.doubleValue;
        case 11:
          if (isSet(object.booleanValue))
            return object.booleanValue;
        case 12:
          if (isSet(object.stringValue))
            return object.stringValue;
        default:
          throw new Error(`Invalid DataSetValue: ${JSON.stringify(object)}`);
      }
    }
    function getTemplateParamValue(type, object) {
      switch (type) {
        case 7:
          if (object.longValue instanceof long_1.default)
            return object.longValue.toInt();
          else if (isSet(object.longValue))
            return object.longValue;
        case 4:
          if (isSet(object.longValue))
            return object.longValue;
        case 9:
          if (isSet(object.floatValue))
            return object.floatValue;
        case 10:
          if (isSet(object.doubleValue))
            return object.doubleValue;
        case 11:
          if (isSet(object.booleanValue))
            return object.booleanValue;
        case 12:
          if (isSet(object.stringValue))
            return object.stringValue;
        default:
          throw new Error(`Invalid Parameter value: ${JSON.stringify(object)}`);
      }
    }
    function encodeType(typeString) {
      switch (typeString.toUpperCase()) {
        case "INT8":
          return 1;
        case "INT16":
          return 2;
        case "INT32":
        case "INT":
          return 3;
        case "INT64":
        case "LONG":
          return 4;
        case "UINT8":
          return 5;
        case "UINT16":
          return 6;
        case "UINT32":
          return 7;
        case "UINT64":
          return 8;
        case "FLOAT":
          return 9;
        case "DOUBLE":
          return 10;
        case "BOOLEAN":
          return 11;
        case "STRING":
          return 12;
        case "DATETIME":
          return 13;
        case "TEXT":
          return 14;
        case "UUID":
          return 15;
        case "DATASET":
          return 16;
        case "BYTES":
          return 17;
        case "FILE":
          return 18;
        case "TEMPLATE":
          return 19;
        case "PROPERTYSET":
          return 20;
        case "PROPERTYSETLIST":
          return 21;
        default:
          return 0;
      }
    }
    function decodeType(typeInt) {
      switch (typeInt) {
        case 1:
          return "Int8";
        case 2:
          return "Int16";
        case 3:
          return "Int32";
        case 4:
          return "Int64";
        case 5:
          return "UInt8";
        case 6:
          return "UInt16";
        case 7:
          return "UInt32";
        case 8:
          return "UInt64";
        case 9:
          return "Float";
        case 10:
          return "Double";
        case 11:
          return "Boolean";
        case 12:
          return "String";
        case 13:
          return "DateTime";
        case 14:
          return "Text";
        case 15:
          return "UUID";
        case 16:
          return "DataSet";
        case 17:
          return "Bytes";
        case 18:
          return "File";
        case 19:
          return "Template";
        case 20:
          return "PropertySet";
        case 21:
          return "PropertySetList";
      }
    }
    function encodeTypes(typeArray) {
      var types = [];
      for (var i = 0; i < typeArray.length; i++) {
        types.push(encodeType(typeArray[i]));
      }
      return types;
    }
    function decodeTypes(typeArray) {
      var types = [];
      for (var i = 0; i < typeArray.length; i++) {
        types.push(decodeType(typeArray[i]));
      }
      return types;
    }
    function encodeDataSet(object) {
      const num = object.numOfColumns, names = object.columns, types = encodeTypes(object.types), rows = object.rows, newDataSet = DataSet.create({
        "numOfColumns": num,
        "columns": object.columns,
        "types": types
      }), newRows = [];
      for (let i = 0; i < rows.length; i++) {
        const newRow = Row.create(), row = rows[i], elements = [];
        for (let t = 0; t < num; t++) {
          const newValue = DataSetValue.create();
          setValue(types[t], row[t], newValue);
          elements.push(newValue);
        }
        newRow.elements = elements;
        newRows.push(newRow);
      }
      newDataSet.rows = newRows;
      return newDataSet;
    }
    function decodeDataSet(protoDataSet) {
      const protoTypes = protoDataSet.types;
      const dataSet = {
        types: decodeTypes(protoTypes),
        rows: []
      };
      const types = decodeTypes(protoTypes), protoRows = protoDataSet.rows || [], num = protoDataSet.numOfColumns;
      for (var i = 0; i < protoRows.length; i++) {
        var protoRow = protoRows[i], protoElements = protoRow.elements || [], rowElements = [];
        for (var t = 0; t < num; t++) {
          rowElements.push(getDataSetValue(protoTypes[t], protoElements[t]));
        }
        dataSet.rows.push(rowElements);
      }
      dataSet.numOfColumns = num;
      dataSet.types = types;
      dataSet.columns = protoDataSet.columns;
      return dataSet;
    }
    function encodeMetaData(object) {
      var metadata = MetaData.create(), isMultiPart = object.isMultiPart, contentType = object.contentType, size = object.size, seq = object.seq, fileName = object.fileName, fileType = object.fileType, md5 = object.md5, description = object.description;
      if (isMultiPart !== void 0 && isMultiPart !== null) {
        metadata.isMultiPart = isMultiPart;
      }
      if (contentType !== void 0 && contentType !== null) {
        metadata.contentType = contentType;
      }
      if (size !== void 0 && size !== null) {
        metadata.size = size;
      }
      if (seq !== void 0 && seq !== null) {
        metadata.seq = seq;
      }
      if (fileName !== void 0 && fileName !== null) {
        metadata.fileName = fileName;
      }
      if (fileType !== void 0 && fileType !== null) {
        metadata.fileType = fileType;
      }
      if (md5 !== void 0 && md5 !== null) {
        metadata.md5 = md5;
      }
      if (description !== void 0 && description !== null) {
        metadata.description = description;
      }
      return metadata;
    }
    function decodeMetaData(protoMetaData) {
      var metadata = {}, isMultiPart = protoMetaData.isMultiPart, contentType = protoMetaData.contentType, size = protoMetaData.size, seq = protoMetaData.seq, fileName = protoMetaData.fileName, fileType = protoMetaData.fileType, md5 = protoMetaData.md5, description = protoMetaData.description;
      if (isMultiPart !== void 0 && isMultiPart !== null) {
        metadata.isMultiPart = isMultiPart;
      }
      if (contentType !== void 0 && contentType !== null) {
        metadata.contentType = contentType;
      }
      if (size !== void 0 && size !== null) {
        metadata.size = size;
      }
      if (seq !== void 0 && seq !== null) {
        metadata.seq = seq;
      }
      if (fileName !== void 0 && fileName !== null) {
        metadata.fileName = fileName;
      }
      if (fileType !== void 0 && fileType !== null) {
        metadata.fileType = fileType;
      }
      if (md5 !== void 0 && md5 !== null) {
        metadata.md5 = md5;
      }
      if (description !== void 0 && description !== null) {
        metadata.description = description;
      }
      return metadata;
    }
    function encodePropertyValue(object) {
      var type = encodeType(object.type), newPropertyValue = PropertyValue.create({
        "type": type
      });
      if (object.value !== void 0 && object.value === null) {
        newPropertyValue.isNull = true;
      }
      setValue(type, object.value, newPropertyValue);
      return newPropertyValue;
    }
    function decodePropertyValue(protoValue) {
      const propertyValue = {
        // @ts-expect-error TODO check exists
        value: getValue(protoValue.type, protoValue),
        type: decodeType(protoValue.type)
      };
      if (protoValue.isNull !== void 0 && protoValue.isNull === true) {
        propertyValue.value = null;
      } else {
        propertyValue.value = getValue(protoValue.type, protoValue);
      }
      propertyValue.type = decodeType(protoValue.type);
      return propertyValue;
    }
    function encodePropertySet(object) {
      const keys = [], values = [];
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          keys.push(key);
          values.push(encodePropertyValue(object[key]));
        }
      }
      return PropertySet.create({
        "keys": keys,
        "values": values
      });
    }
    function decodePropertySet(protoSet) {
      const propertySet = {}, protoKeys = protoSet.keys || [], protoValues = protoSet.values || [];
      for (var i = 0; i < protoKeys.length; i++) {
        propertySet[protoKeys[i]] = decodePropertyValue(protoValues[i]);
      }
      return propertySet;
    }
    function encodePropertySetList(object) {
      const propertySets = [];
      for (let i = 0; i < object.length; i++) {
        propertySets.push(encodePropertySet(object[i]));
      }
      return PropertySetList.create({
        "propertyset": propertySets
      });
    }
    function decodePropertySetList(protoSetList) {
      const propertySets = [], protoSets = protoSetList.propertyset || [];
      for (let i = 0; i < protoSets.length; i++) {
        propertySets.push(decodePropertySet(protoSets[i]));
      }
      return propertySets;
    }
    function encodeParameter(object) {
      const type = encodeType(object.type), newParameter = Parameter.create({
        "name": object.name,
        "type": type
      });
      setValue(type, object.value, newParameter);
      return newParameter;
    }
    function decodeParameter(protoParameter) {
      const protoType = protoParameter.type, parameter = {
        value: getTemplateParamValue(protoType, protoParameter),
        type: decodeType(protoType)
      };
      parameter.name = protoParameter.name;
      parameter.type = decodeType(protoType);
      parameter.value = getValue(protoType, protoParameter);
      return parameter;
    }
    function encodeTemplate(object) {
      let template = Template.create(), metrics = object.metrics, parameters = object.parameters, isDef = object.isDefinition, ref = object.templateRef, version = object.version;
      if (version !== void 0 && version !== null) {
        template.version = version;
      }
      if (ref !== void 0 && ref !== null) {
        template.templateRef = ref;
      }
      if (isDef !== void 0 && isDef !== null) {
        template.isDefinition = isDef;
      }
      if (object.metrics !== void 0 && object.metrics !== null) {
        const newMetrics = [];
        metrics = object.metrics;
        for (let i = 0; i < metrics.length; i++) {
          newMetrics.push(encodeMetric(metrics[i]));
        }
        template.metrics = newMetrics;
      }
      if (object.parameters !== void 0 && object.parameters !== null) {
        const newParameter = [];
        for (let i = 0; i < object.parameters.length; i++) {
          newParameter.push(encodeParameter(object.parameters[i]));
        }
        template.parameters = newParameter;
      }
      return template;
    }
    function decodeTemplate(protoTemplate) {
      const template = {}, protoMetrics = protoTemplate.metrics, protoParameters = protoTemplate.parameters, isDef = protoTemplate.isDefinition, ref = protoTemplate.templateRef, version = protoTemplate.version;
      if (version !== void 0 && version !== null) {
        template.version = version;
      }
      if (ref !== void 0 && ref !== null) {
        template.templateRef = ref;
      }
      if (isDef !== void 0 && isDef !== null) {
        template.isDefinition = isDef;
      }
      if (protoMetrics !== void 0 && protoMetrics !== null) {
        const metrics = [];
        for (let i = 0; i < protoMetrics.length; i++) {
          metrics.push(decodeMetric(protoMetrics[i]));
        }
        template.metrics = metrics;
      }
      if (protoParameters !== void 0 && protoParameters !== null) {
        const parameter = [];
        for (let i = 0; i < protoParameters.length; i++) {
          parameter.push(decodeParameter(protoParameters[i]));
        }
        template.parameters = parameter;
      }
      return template;
    }
    function encodeMetric(metric) {
      const newMetric = Metric.create({
        name: metric.name
      }), value = metric.value, datatype = encodeType(metric.type), alias = metric.alias, isHistorical = metric.isHistorical, isTransient = metric.isTransient, metadata = metric.metadata, timestamp = metric.timestamp, properties = metric.properties;
      newMetric.datatype = datatype;
      setValue(datatype, value, newMetric);
      if (timestamp !== void 0 && timestamp !== null) {
        newMetric.timestamp = timestamp;
      }
      if (alias !== void 0 && alias !== null) {
        newMetric.alias = alias;
      }
      if (isHistorical !== void 0 && isHistorical !== null) {
        newMetric.isHistorical = isHistorical;
      }
      if (isTransient !== void 0 && isTransient !== null) {
        newMetric.isTransient = isTransient;
      }
      if (value !== void 0 && value === null) {
        newMetric.isNull = true;
      }
      if (metadata !== void 0 && metadata !== null) {
        newMetric.metadata = encodeMetaData(metadata);
      }
      if (properties !== void 0 && properties !== null) {
        newMetric.properties = encodePropertySet(properties);
      }
      return newMetric;
    }
    function decodeMetric(protoMetric) {
      const metric = {
        // @ts-expect-error TODO check exists
        value: getValue(protoMetric.datatype, protoMetric),
        type: decodeType(protoMetric.datatype)
      };
      if (protoMetric.hasOwnProperty("name")) {
        metric.name = protoMetric.name;
      }
      if (protoMetric.hasOwnProperty("isNull") && protoMetric.isNull === true) {
        metric.value = null;
      } else {
        metric.value = getValue(protoMetric.datatype, protoMetric);
      }
      if (protoMetric.hasOwnProperty("timestamp")) {
        metric.timestamp = protoMetric.timestamp;
      }
      if (protoMetric.hasOwnProperty("alias")) {
        metric.alias = protoMetric.alias;
      }
      if (protoMetric.hasOwnProperty("isHistorical")) {
        metric.isHistorical = protoMetric.isHistorical;
      }
      if (protoMetric.hasOwnProperty("isTransient")) {
        metric.isTransient = protoMetric.isTransient;
      }
      if (protoMetric.hasOwnProperty("metadata") && protoMetric.metadata) {
        metric.metadata = decodeMetaData(protoMetric.metadata);
      }
      if (protoMetric.hasOwnProperty("properties") && protoMetric.properties) {
        metric.properties = decodePropertySet(protoMetric.properties);
      }
      return metric;
    }
    function encodePayload(object) {
      var payload = Payload.create({
        "timestamp": object.timestamp
      });
      if (object.metrics !== void 0 && object.metrics !== null) {
        var newMetrics = [], metrics = object.metrics;
        for (var i = 0; i < metrics.length; i++) {
          newMetrics.push(encodeMetric(metrics[i]));
        }
        payload.metrics = newMetrics;
      }
      if (object.seq !== void 0 && object.seq !== null) {
        payload.seq = object.seq;
      }
      if (object.uuid !== void 0 && object.uuid !== null) {
        payload.uuid = object.uuid;
      }
      if (object.body !== void 0 && object.body !== null) {
        payload.body = object.body;
      }
      return Payload.encode(payload).finish();
    }
    exports2.encodePayload = encodePayload;
    function decodePayload(proto) {
      var sparkplugPayload = Payload.decode(proto), payload = {};
      if (sparkplugPayload.hasOwnProperty("timestamp")) {
        payload.timestamp = sparkplugPayload.timestamp;
      }
      if (sparkplugPayload.hasOwnProperty("metrics")) {
        const metrics = [];
        for (var i = 0; i < sparkplugPayload.metrics.length; i++) {
          metrics.push(decodeMetric(sparkplugPayload.metrics[i]));
        }
        payload.metrics = metrics;
      }
      if (sparkplugPayload.hasOwnProperty("seq")) {
        payload.seq = sparkplugPayload.seq;
      }
      if (sparkplugPayload.hasOwnProperty("uuid")) {
        payload.uuid = sparkplugPayload.uuid;
      }
      if (sparkplugPayload.hasOwnProperty("body")) {
        payload.body = sparkplugPayload.body;
      }
      return payload;
    }
    exports2.decodePayload = decodePayload;
  }
});

// node_modules/sparkplug-payload/index.js
var require_sparkplug_payload = __commonJS({
  "node_modules/sparkplug-payload/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod2) {
      if (mod2 && mod2.__esModule) return mod2;
      var result = {};
      if (mod2 != null) {
        for (var k in mod2) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k)) __createBinding(result, mod2, k);
      }
      __setModuleDefault(result, mod2);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.get = void 0;
    var sparkplugbpayload = __importStar(require_sparkplugbpayload());
    function get(namespace) {
      if (namespace !== void 0 && namespace !== null) {
        if (namespace === "spBv1.0") {
          return sparkplugbpayload;
        }
      }
      return null;
    }
    exports2.get = get;
  }
});

// main.js
var sparkplug = require_sparkplug_payload().get("spBv1.0");
var bytes = [
  8,
  -7,
  -19,
  -123,
  -95,
  -86,
  51,
  18,
  23,
  10,
  8,
  109,
  116,
  110,
  47,
  97,
  116,
  116,
  49,
  24,
  -24,
  -19,
  -123,
  -95,
  -86,
  51,
  32,
  4,
  56,
  0,
  88,
  1,
  18,
  23,
  10,
  8,
  109,
  116,
  110,
  47,
  97,
  116,
  116,
  50,
  24,
  -24,
  -19,
  -123,
  -95,
  -86,
  51,
  32,
  4,
  56,
  0,
  88,
  2,
  18,
  23,
  10,
  8,
  109,
  116,
  110,
  47,
  97,
  116,
  116,
  51,
  24,
  -24,
  -19,
  -123,
  -95,
  -86,
  51,
  32,
  4,
  56,
  0,
  88,
  3,
  24,
  3
];
var encoded = bytes.map((obj, index) => obj >>> 0);
console.log(sparkplug.decodePayload(encoded));
