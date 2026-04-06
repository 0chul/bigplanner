import{c as o,r as u,j as s,X as m,s as h}from"./index-BwNOKtIA.js";import{S as f}from"./send-DDpivXAf.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],v=o("check",b);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],k=o("chevron-down",p);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],S=o("chevron-up",w);function N({name:n,phone:c,onClose:t}){const[a,x]=u.useState(`안녕하세요 ${n}님, 건축 상담 문의 남겨주셔서 연락드렸습니다.
www.bigplanner.co.kr`),[l,i]=u.useState(!1),g=async()=>{i(!0);try{const{data:e,error:r}=await h.functions.invoke("send-sms",{body:{receiver:c.replace(/-/g,""),msg:a,name:n}});if(r)throw new Error(r.message||"Supabase Function 호출 실패");if(e!=null&&e.error)throw new Error(e.error);if((e==null?void 0:e.statusCode)==="2000"||e!=null&&e.messageId)alert("문자가 성공적으로 전송되었습니다."),t(!0);else{const d=(e==null?void 0:e.errorMessage)||(e==null?void 0:e.error)||"알 수 없는 오류";alert(`전송 실패: ${d}`),t(!1,d)}}catch(e){console.error("SMS error:",e);const r=e.message||"문자 전송 중 오류가 발생했습니다.";alert(`오류 발생: ${r}`),t(!1,r)}finally{i(!1)}};return s.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:s.jsxs("div",{className:"bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl",children:[s.jsxs("div",{className:"flex justify-between items-center mb-4",children:[s.jsx("h2",{className:"text-lg font-bold",children:"문자 보내기"}),s.jsx("button",{onClick:t,className:"text-gray-400 hover:text-gray-600",children:s.jsx(m,{size:20})})]}),s.jsxs("p",{className:"text-sm text-gray-600 mb-4",children:["수신: ",n," (",c,")"]}),s.jsx("textarea",{value:a,onChange:e=>x(e.target.value),className:"w-full p-3 border border-gray-200 rounded-xl mb-4 h-32 focus:ring-2 focus:ring-black outline-none"}),s.jsx("button",{onClick:g,disabled:l,className:"w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2",children:l?"전송 중...":s.jsxs(s.Fragment,{children:[s.jsx(f,{size:18})," 전송하기"]})})]})})}export{S as C,N as S,k as a,v as b};
//# sourceMappingURL=SMSModal-CMS75ZzI.js.map
