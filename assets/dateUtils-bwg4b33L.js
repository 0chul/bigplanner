const r=o=>{const t=new Date(o),e=Math.floor((new Date().getTime()-t.getTime())/1e3);return e<60?"방금 전":e<3600?`${Math.floor(e/60)}분 전`:e<86400?`${Math.floor(e/3600)}시간 전`:e<2592e3?`${Math.floor(e/86400)}일 전`:t.toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"})};export{r as g};
//# sourceMappingURL=dateUtils-bwg4b33L.js.map
