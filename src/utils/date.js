const moment = require('moment-timezone');
require('moment/locale/id');

moment.locale('id');

const tanggalLengkap = moment().tz('Asia/Jakarta').format('dddd, D MMMM YYYY');
const jamMenit = moment().tz('Asia/Jakarta').format('HH.mm');
const jam = moment().tz('Asia/Jakarta').hour();

let labelWaktu = '';

if (jam >= 0 && jam < 4) labelWaktu = 'Subuh';
else if (jam < 11) labelWaktu = 'Pagi';
else if (jam < 15) labelWaktu = 'Siang';
else if (jam < 18) labelWaktu = 'Sore';
else labelWaktu = 'Malam';

const waktu_sekarang = `${tanggalLengkap}, Jam ${jamMenit} ${labelWaktu}`;
function logger_timestamp() {
    return moment().tz('Asia/Jakarta').format('HH:mm:ss, DD/MM/YYYY');
}

module.exports = { waktu_sekarang, logger_timestamp };