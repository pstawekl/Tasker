(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[665],{13567:function(e,t,s){Promise.resolve().then(s.bind(s,37455))},37455:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return LoginPage}});var a=s(57437),r=s(33751),n=s(23611),i=s(5759),l=s(27007),o=s(16691),c=s.n(o),d=s(24033),u=s(2265);function LoginPage(){let[e,t]=(0,u.useState)(""),[s,o]=(0,u.useState)(""),[h,g]=(0,u.useState)(""),f=(0,d.useRouter)(),handleGoogleSignIn=async()=>{try{let e=await (0,l.rh)(r.I8,r.Vv);e.user&&f.push("/dashboard")}catch(e){console.error("Error signing in with Google:",e)}},handleLogin=async t=>{t.preventDefault();try{let t=await (0,l.e5)(r.I8,e,s),a=t.user;a&&a.uid?fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({firebaseId:a.uid,email:a.email,username:a.displayName,createdAt:a.metadata.creationTime,picture:a.photoURL})}).then(e=>e.json()).then(e=>{let{user:t}=e;t&&(localStorage.setItem("user",JSON.stringify(t)),f.push("/dashboard"))}).catch(e=>{alert(e)}).finally(()=>f.push("/")):alert("User UID is not defined.")}catch(e){g(e.message)}};return(0,a.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gray-100",children:(0,a.jsxs)("div",{className:"p-8 bg-white rounded-lg shadow-md w-96 flex flex-col gap-4",children:[(0,a.jsx)("div",{className:"flex justify-center",children:(0,a.jsx)(c(),{src:i.Z,alt:"logo",width:50})}),(0,a.jsxs)("div",{className:"top-content flex flex-col gap-4",children:[(0,a.jsx)("h1",{className:"text-2xl font-normal text-center",children:"Witaj"}),(0,a.jsx)("h3",{className:"text-gray-500 font-light text-center",children:"Zaloguj się do aplikacji Tasker używając adresu e-mail lub konta Google"})]}),h&&(0,a.jsx)("p",{className:"text-red-500 mb-4",children:h}),(0,a.jsxs)("form",{onSubmit:handleLogin,children:[(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{className:"block text-sm font-medium mb-2",htmlFor:"email",children:"Email"}),(0,a.jsx)("input",{id:"email",type:"email",value:e,onChange:e=>t(e.target.value),className:"w-full p-2 border rounded",required:!0})]}),(0,a.jsxs)("div",{className:"mb-6",children:[(0,a.jsx)("label",{className:"block text-sm font-medium mb-2",htmlFor:"password",children:"Password"}),(0,a.jsx)("input",{id:"password",type:"password",value:s,onChange:e=>o(e.target.value),className:"w-full p-2 border rounded",required:!0})]}),(0,a.jsxs)(n.z,{type:"submit",variant:"black",className:"w-100",children:[(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",className:"lucide lucide-log-in",children:[(0,a.jsx)("path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"}),(0,a.jsx)("polyline",{points:"10 17 15 12 10 7"}),(0,a.jsx)("line",{x1:"15",x2:"3",y1:"12",y2:"12"})]}),"Zaloguj się"]})]}),(0,a.jsxs)("div",{className:"other-sign-in-methods flex flex-col gap-4",children:[(0,a.jsxs)("div",{className:"w-100 flex flex-row items-center",children:[(0,a.jsx)("div",{className:"splitter bg-gray-500 h-[1px] w-100"}),(0,a.jsx)("div",{className:"px-3",children:"LUB"}),(0,a.jsx)("div",{className:"splitter bg-gray-500 h-[1px] w-100"})]}),(0,a.jsxs)(n.z,{className:"w-100",variant:"outline",onClick:handleGoogleSignIn,children:[(0,a.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",x:"0px",y:"0px",width:"150",height:"150",viewBox:"0 0 48 48",children:[(0,a.jsx)("path",{fill:"#FFC107",d:"M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"}),(0,a.jsx)("path",{fill:"#FF3D00",d:"M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"}),(0,a.jsx)("path",{fill:"#4CAF50",d:"M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"}),(0,a.jsx)("path",{fill:"#1976D2",d:"M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"})]}),"Zaloguj się przez Google"]})]})]})})}},33751:function(e,t,s){"use strict";s.d(t,{I8:function(){return i},Vv:function(){return l}});var a=s(20994),r=s(27007);let n=(0,a.ZF)({apiKey:"AIzaSyD5GyfxeMverkZ7ncS63-ePqUyStyo0QA8",authDomain:"tasker-a491a.firebaseapp.com",projectId:"tasker-a491a",storageBucket:"tasker-a491a.firebasestorage.app",messagingSenderId:"111363514995",appId:"1:111363514995:web:132ef6f1c1f87739d2c006"}),i=(0,r.v0)(n),l=new r.hJ},23611:function(e,t,s){"use strict";s.d(t,{d:function(){return o},z:function(){return c}});var a=s(57437),r=s(67256),n=s(96061),i=s(2265),l=s(81628);let o=(0,n.j)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{black:"bg-slate-950 text-white hover:bg-slate-800",default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border text-gray-500 border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary hover:bg-secondary/80 text-white-500",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),c=i.forwardRef((e,t)=>{let{className:s,variant:n,size:i,asChild:c=!1,...d}=e,u=c?r.g7:"button";return(0,a.jsx)(u,{className:(0,l.cn)(o({variant:n,size:i,className:s})),ref:t,...d})});c.displayName="Button"},81628:function(e,t,s){"use strict";s.d(t,{cn:function(){return cn}});var a=s(57042),r=s(74769);function cn(){for(var e=arguments.length,t=Array(e),s=0;s<e;s++)t[s]=arguments[s];return(0,r.m6)((0,a.W)(t))}},5759:function(e,t){"use strict";t.Z={src:"/_next/static/media/logo.9d6a7e80.webp",height:237,width:238,blurDataURL:"data:image/webp;base64,UklGRq4AAABXRUJQVlA4WAoAAAAQAAAABwAABwAAQUxQSDgAAAABN6AmABKGuPQlC9fQGhER+LxFqIlsxVXU0X+CgEsCMEEPCi5F9D/2Kgrgm3gy0BhoJp4B/L2KAFZQOCBQAAAAsAEAnQEqCAAIAAJAOCWkAAL8VX37QAD+9MfchfI6Gz1uhpI1Cnx/3H3vL51+u/6J3IsOXM7etEP4A9p8s474aAsmnbOPJk5/OwgNhwAAAAA=",blurWidth:8,blurHeight:8}},24033:function(e,t,s){e.exports=s(50094)}},function(e){e.O(0,[966,312,621,691,971,472,744],function(){return e(e.s=13567)}),_N_E=e.O()}]);