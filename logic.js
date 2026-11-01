// Pure booking logic (shared by app and tests)
const BOOK_DAYS=[0,1,4,5]; // Sun Mon Thu Fri
const SLOT='5:00-7:00 PM CT';
function key(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function isBookable(d){return BOOK_DAYS.includes(d.getDay());}
function slotsInMonth(y,m){const out=[];const d=new Date(y,m,1);while(d.getMonth()===m){if(isBookable(d))out.push(key(d));d.setDate(d.getDate()+1);}return out;}
function book(bookings,date,artistId){const [y,mo,da]=date.split('-').map(Number);if(!isBookable(new Date(y,mo-1,da)))return {ok:false,err:'Not a bookable day'};if(bookings[date]!=null&&bookings[date]!==artistId)return {ok:false,err:'Slot already booked'};bookings[date]=artistId;return {ok:true};}
function counts(bookings,ids,y,m){const c={};ids.forEach(i=>c[i]=0);slotsInMonth(y,m).forEach(k=>{if(bookings[k]!=null&&k in bookings&&c[bookings[k]]!=null)c[bookings[k]]++;});return c;}
function autoFill(bookings,ids,y,m){const c=counts(bookings,ids,y,m);let last=null;for(const k of slotsInMonth(y,m)){if(bookings[k]!=null){last=bookings[k];continue;}const pick=ids.filter(i=>i!==last).sort((a,b)=>c[a]-c[b]||ids.indexOf(a)-ids.indexOf(b))[0];bookings[k]=pick;c[pick]++;last=pick;}return bookings;}
if(typeof module!=='undefined')module.exports={BOOK_DAYS,SLOT,key,isBookable,slotsInMonth,book,counts,autoFill};
