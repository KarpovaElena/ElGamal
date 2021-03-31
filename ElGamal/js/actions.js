var p, g, x, y, k, arr_m = [], a, b = '', m, encryptedMsg, decryptedMsg;
var alphabet = [];

function createAlphabet() {

  alphabet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' '];

  for (var i = 'а'.charCodeAt(0); i <= 'я'.charCodeAt(0); i++) {

    alphabet.push(String.fromCharCode(i));

  }

  alphabet.push('ё');

  for (var i = 'А'.charCodeAt(0); i <= 'Я'.charCodeAt(0); i++) {

    alphabet.push(String.fromCharCode(i));

  }

  alphabet.push('Ё');

  for (var i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {

    alphabet.push(String.fromCharCode(i));

  }

  for (var i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {

    alphabet.push(String.fromCharCode(i));

  }

  alphabet.push(',');
  alphabet.push('.');
  alphabet.push('-');
  alphabet.push('_');
  alphabet.push(';');
  alphabet.push(':');
  alphabet.push('(');
  alphabet.push(')');
  alphabet.push('[');
  alphabet.push(']');
  alphabet.push('{');
  alphabet.push('}');
  alphabet.push('<');
  alphabet.push('>');
  alphabet.push('?');
  alphabet.push('!');
  alphabet.push('"');
  alphabet.push('\\');
  alphabet.push('\'');
  alphabet.push('/');
  alphabet.push('&');
  alphabet.push('|');
  alphabet.push('$');
  alphabet.push('#');
  alphabet.push('*');
  alphabet.push('%');
  alphabet.push('№');
  alphabet.push('`');
  alphabet.push('~');
  alphabet.push('+');
  alphabet.push('=');
  alphabet.push('^');
  
  getEnter();

}

function getEnter() {
    $.ajax({
        type: 'POST',
        url: './ajax/get_enter.php',
        success: function(data) {
            alphabet.push(data);
        }
    });
}

function isPrime(n) {

  if (n < 2) {
    return 0;
  } else if (n === 2) {
    return 1;
  }

  let i = 2;
  const limit = Math.sqrt(n);
  while (i <= limit) {
    if (n % i === 0) {
      return 0;
    }
    i +=1;
  }
  
  return 1;

}

function displayError(msg) {

  alert(msg);

}

function isInteger(num) {

  return (num ^ 0) === num;

}

function getRandomInt(min, max) {

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;

}

function generateP() {

  var genP = 200;
  while (!isPrime(genP)) {

    genP = getRandomInt(200, 1000);

  }

  return genP;

}

document.addEventListener("DOMContentLoaded", function(event) { 

  $('#exampleP').text(generateP());
  createAlphabet();
  printAlphabet();

});

function printAlphabet() {
    
    var str = '';
    for (var i = 0; i < alphabet.length; i++) {
        if (alphabet[i] == ' ') {
            str += '<div>Пробел</div>';
        } else {
            str += '<div>'+alphabet[i]+'</div>';
        }
    }
    
    $('#alphabet').html(str);
    
}

$('#p').blur(function() {
  
  p = parseInt($('#p').val());

  if (p == '') {

    displayError('Вы не ввели коэффициент P!');

  } else {

    if (p < 200 || p > 1000) {

      displayError('Коэффициент P должен быть в диапазоне от 200 до 1000!');

    } else {

      if (isPrime(p)) {

        for (var i = 2; i < p; i++) {

          var res = Math.pow(i, p-1) % p;
          if (res == 1) {
            g = i;
            $('#g').val(g);
            break
          }

        }

        getGen();
        getX();
        getY();

      } else {

        displayError('Коэффициент P должен быть простым!')

      }

    }

  }

});

$('#g').blur(function() {
  
  g = $('#g').val();

});

$('#g').change(function() {
  
  g = $('#g').val();
  getX();
  getY();

});

$('#x').blur(function() {

  x = parseInt($('#x').val());

  if (x == '') {

    displayError('Вы не ввели Ваш секретный ключ X!');

  } else {

    if (p == '' || g == '') {

      displayError('Сначала нужно ввести коэффициенты P и G!');

    } else {

      if (x >= p || !Number.isInteger(x)) {

        displayError('Секретный ключ X должен быть меньше P и быть целым числом!');

      } else {
          
        g = $('#g').val();
        getY();
        $('#y').text(y);

      }

    }

  }

});

$('#x').keyup(function() {
    x = parseInt($('#x').val());
    g = $('#g').val();
    if (x > 0 && g > 0) {
        getY();
        $('#y').text(y);
    }
});

$('#message').change(function() {

  m = $('#message').val();

  if (m == '') {

    displayError('Вы не ввели сообщение, которое требуется зашифровать!');

  } else {

    arr_m = [];

    for (i = 0; i < m.length; i++) {

      arr_m.push(alphabet.indexOf(m[i]));

    }

  }

});


$('#k').blur(function() {

  k = parseInt($('#k').val());

  if (k == '') {

    displayError('Введите коэффициент K в диапазоне от 1 до P-1!');

  } else {

    /*var encryptData = encryptMsg();
    a = encryptData.a;
    b = encryptData.b;

    $('#a').text(a);
    $('#b').val(b);*/

  }

});

function binpow(a1, n1) {

  if (n1 == 0) return 1;

  if (n1 % 2 == 1) {
    return binpow(a1, n1-1) * a1;
  } else {

    var b1 = binpow(a1, n1/2);
    return b1*b1;

  }

}

var getAllRootsAsync = function (p, work) {
        var r = 2;

        if (!isPrime(p)) {
          throw Error("Enter a valid prime number");
        }

        (function loop() {
          var j, roots = [];
          for (j = 0; j + r < p || j < 20; j += 1) {
              if (isPrimitiveRoot(r, p)) {
                  roots.push(r);
              }
              r += 1;
          }
          work(roots);

          if (j + r < p) {
            setTimeout(loop, 24);
          }
        }());

        return 0;
    };

var isPrimitiveRoot = function (g, p) {

        var o = 1,
            k = powmod(g, o, p);
        while (k > 1) {
            o++;
            k *= g;
            k %= p;
        }
        if (o === (p - 1)) {
            return true;
        }
        return false;
    };

var powmod = function (base, exp, modulus) {
        var accum = 1, i = 0, basepow2 = base;
        if (exp === -1) {
            return extendedEuclid(base, modulus).x;
        }
        while ((exp >> i) > 0) {
            if (((exp >> i) & 1) === 1) {
                accum = (accum * basepow2) % modulus;
            }
            basepow2 = (basepow2 * basepow2) % modulus;
            i += 1;
        }
        return accum;
    };

var extendedEuclid = function (a, b) {
        var u1 = 1, u2 = 0, u3 = a,
            v1 = 0, v2 = 1, v3 = b,
            q, t1, t2, t3;

        while (v3 !== 0) {
            q = Math.floor(u3/v3);
            t1 = u1 - q*v1;
            t2 = u2 - q*v2;
            t3 = u3 - q*v3;
            u1 = v1; u2 = v2; u3 = v3;
            v1 = t1; v2 = t2; v3 = t3;
        }
        return {'x': u1, 'y': u2, 'd': u3};
    };

function getGen() {

  p = parseInt($('#p').val());
  var roots = [];
  
  $('#g').html('');
  
  getAllRootsAsync(p, function (roots) {
      document.getElementById('g').innerHTML += roots.map(function (r) {
          return '<option value="' + r + '">' + r + '</option>';
      }).join('');
  });

}

function getX() {

  p = parseInt($('#p').val());
  x = Math.ceil(Math.random() * p);
  while (x > (p/3)) {
    x = Math.ceil(Math.random() * p);  
  }
  $('#x').val(x);

}

function getY() {

  /*p = parseInt($('#p').val());*/
  /*y = Math.pow(g, x) % p;*/
  y = powmod(g, x, p);
  $('#y').text(y);

}

function getK() {

  p = parseInt($('#p').val());
  k = Math.ceil(Math.random() * p);
  $('#k').val(k);

}



function encryptMsg(flag) {

  var timeStart = getMicrotime();

  a = powmod(g, k, p);

  b = '';
  for (i = 0; i < arr_m.length; i++) {

    b += (((arr_m[i] * (powmod(y, k, p))) % p) + ' ');

  }
  
  b = b.trim();
  
  $('#a').text(a);
  $('#b').val(b);

  var timeEnd = getMicrotime();
  $('#timeResEncrypt').text('Шифрование выполнено за ' + (timeEnd - timeStart) + ' ms');
  
  if (flag != 0) {
    setFileLink('#b');
  }

  return {
    a: a,
    b: b
  }

}

function decryptMsg() {

  b = b.trim();
  var decodedMsg = '';

  b = b.split(' ');

  var ay = powmod(a, x, p), s;

  for (i = 0; i < b.length; i++) {

    s = (powmod(ay, -1, p) * parseInt(b[i])) % p;
    s = s < 0 ? s + p : s;

    decodedMsg += (''+alphabet[s]);

  }

  $('#decodedMsg').text(decodedMsg);
  return decodedMsg;

}

function decryptUserMsg() {

  var timeStart = getMicrotime();

  var userA = parseInt($('#userA').val());
  var userB = $('#userB').val();
  var userX = parseInt($('#userX').val());
  var userP = parseInt($('#userP').val());

  userB = userB.trim();
  userB = userB.split(' ');
  var decodedMsg = '';
  var ay = powmod(userA, userX, userP);
  var s;

  for (i = 0; i < userB.length; i++) {

    s = (powmod(ay, -1, userP) * parseInt(userB[i])) % userP;
    s = s < 0 ? s + userP : s;

    decodedMsg += (''+alphabet[s]);

  }

  $('#decodedUserMsg').val(decodedMsg);
  setFileLink('#decodedUserMsg');
  var timeEnd = getMicrotime();
  $('#timeResDecrypt').text('Дешифрование выполнено за ' + (timeEnd - timeStart) + ' ms');

  return decodedMsg;

}

function getMicrotime() {
  return new Date().getTime();
}

function upload(file, selector_id) {
    
    let xhr = new XMLHttpRequest();
  
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            
            var response = JSON.parse(xhr.responseText);
            if (selector_id == 'file_encrypt') {
                
                if (response['status'] == 1) {
                    $('#message').val(response['fileContent']);
                    $('#message').change();
                } else if (response['status'] == 0) {
                    $('#file_encrypt').val('');
                }
                
            } else if (selector_id == 'file_decrypt') {
                
                if (response['status'] == 1) {
                    $('#userB').val(response['fileContent']);
                } else if (response['status'] == 0) {
                    $('#file_decrypt').val('');
                }
                
            }
            
        }
    }
    
    var formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", "./ajax/upload_ajax.php");
    xhr.send(formData);
}

function setFileLink(selector_id) {
    
    $.ajax({
        type: 'POST',
        url: './ajax/download_file.php',
        data: {
            text: $(selector_id).val()
        },
        success: function(data) {
            if (selector_id == '#b') {
                $('#downloadEncrypted').attr('href',data);
                $('#downloadEncrypted').css('display','block');
            } else if (selector_id == '#decodedUserMsg') {
                $('#downloadDecrypted').attr('href',data);
                $('#downloadDecrypted').css('display','block');
            }
        }
    });
    
}

function genSender() {
    
    p = generateP();
    $('#p').val(p);
    $('#p').blur();

    g = $('#g').val();
    $('#g').blur();
    
    getX();
    
    y = powmod(g, x, p);
    $('#y').text(y);
    
    m = genMessage();
    $('#message').val(m);
    $('#message').change();
    
    getK();
    
    encryptedMsg = encryptMsg(0).b;
    
    $('*').val('');
    $('#g').html('');
    $('#y').text('...');
    $('#a').text('');
    $('#timeResEncrypt').css('display','none');
    setTimeout(function() {
        $('#downloadEncrypted').removeAttr('style');
    },150);
    
    var genStr = '';
    genStr += ('P = ' + p + '<br><br>');
    genStr += ('G = ' + g + '<br><br>');
    genStr += ('X = ' + x + '<br><br>');
    genStr += ('Y = ' + y + '<br><br>');
    genStr += ('M (сообщение) = ' + m + '<br><br>');
    genStr += ('K = ' + k + '<br><br>');
    genStr += ('<input type="text" id="senderCheck"><button onclick="check_sender()">Проверить</button>&nbsp;&nbsp;');
    genStr += ('<span id="resSenderCheck"></span>');
    
    $('#genSenderResult').html(genStr);
}

function genG(p) {
    
    var r = 2;
    var j, roots = [];
    
    for (j = 0; j + r < p || j < 20; j += 1) {
        if (isPrimitiveRoot(r, p)) {
            roots.push(r);
        }
        r += 1;
    }
    
    var rand_g = getRandomInt(0, roots.length-1);
    
    return roots[rand_g];
    
}

function genMessage() {
    
    var randMsg = '';
    for (var i = 0; i < 10; i++) {
        var rand_symb = alphabet[getRandomInt(0, alphabet.length-1)];
        if (rand_symb !== ' ') {
            randMsg += (''+rand_symb);
        }
    }
    
    return randMsg;
    
}

function encryptSenderMsg() {

  a = powmod(g, k, p);

  b = '';
  for (i = 0; i < arr_m.length; i++) {

    b += (((arr_m[i] * (powmod(y, k, p))) % p) + ' ');

  }
  
  b = b.trim();
  
  return b;

}

function check_sender() {
    
    var userMsg = $('#senderCheck').val();
    
    if (userMsg == encryptedMsg) {
        $('#resSenderCheck').html('<font color="green" style="font-weight: bold;">Верно!</font>');
    } else {
        $('#resSenderCheck').html('<font color="red" style="font-weight: bold;">Неверно!</font>');
    }
    
}

function genRecipient() {
    
    p = generateP();
    $('#p').val(p);
    $('#p').blur();

    g = $('#g').val();
    $('#g').blur();
    
    getX();
    
    y = powmod(g, x, p);
    $('#y').text(y);
    
    m = genMessage();
    $('#message').val(m);
    $('#message').change();
    decryptedMsg = m;
    
    getK();
    
    b = encryptMsg(0).b;
    
    $('*').val('');
    $('#g').html('');
    $('#y').text('...');
    $('#a').text('');
    $('#timeResEncrypt').css('display','none');
    setTimeout(function() {
        $('#downloadEncrypted').removeAttr('style');
    },150);
    
    var genStr = '';
    genStr += ('P = ' + p + '<br><br>');
    genStr += ('X = ' + x + '<br><br>');
    genStr += ('A = ' + a + '<br><br>');
    genStr += ('B = ' + b + '<br><br>');
    genStr += ('<input type="text" id="recipientCheck"><button onclick="check_recipient()">Проверить</button>&nbsp;&nbsp;');
    genStr += ('<span id="resRecipientCheck"></span>');
    
    $('#genRecipientResult').html(genStr);
    
}

function check_recipient() {
    
    var userDecryptedMsg = $('#recipientCheck').val();
    
    if (userDecryptedMsg == decryptedMsg) {
        $('#resRecipientCheck').html('<font color="green" style="font-weight: bold;">Верно!</font>');
    } else {
        $('#resRecipientCheck').html('<font color="red" style="font-weight: bold;">Неверно!</font>');
    }
    
}