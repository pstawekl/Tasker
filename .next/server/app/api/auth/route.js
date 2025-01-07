"use strict";(()=>{var e={};e.id=932,e.ids=[932],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27772:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>d,originalPathname:()=>h,requestAsyncStorage:()=>c,routeModule:()=>i,serverHooks:()=>l,staticGenerationAsyncStorage:()=>p,staticGenerationBailout:()=>_});var a={};t.r(a),t.d(a,{POST:()=>POST}),t(78976);var o=t(10884),s=t(16132),n=t(46837),u=t(95798);async function POST(e){try{console.log("on the server");let{firebaseId:r,email:t,username:a,createdAt:o,picture:s}=await e.json();console.log("after req.body",{firebaseId:r,email:t,username:a,createdAt:o,picture:s});let i="SELECT * FROM users WHERE firebase_id = $1",c=await (0,n.J)(i,[r]),p=c.rows[0];if(console.log("after checkQuery"),!p){let e=`
        INSERT INTO users (firebase_id, email, username, created_at, picture)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;await (0,n.J)(e,[r,t,a,o,s]),p=(c=await (0,n.J)(i,[r])).rows[0]}return console.log("after insertQuery"),u.Z.json({user:p},{status:200})}catch(e){return console.error("Database error:",e),u.Z.json({error:"Internal Server Error"},{status:500})}}let i=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/auth/route",pathname:"/api/auth",filename:"route",bundlePath:"app/api/auth/route"},resolvedPagePath:"C:\\Users\\STW\\OneDrive\\Dokumenty\\VSC Projects\\Tasker-For-Firebase\\app\\api\\auth\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:c,staticGenerationAsyncStorage:p,serverHooks:l,headerHooks:d,staticGenerationBailout:_}=i,h="/api/auth/route"},46837:(e,r,t)=>{t.d(r,{J:()=>executeQuery});let a=require("pg"),o={user:process.env.DB_USER,password:process.env.DB_PASSWORD,host:process.env.DB_HOST,database:process.env.DB_NAME,port:parseInt(process.env.DB_PORT,10),ssl:!1},s=new a.Pool(o);async function executeQuery(e,r){try{let t=await s.connect(),a=await t.query(e,r);return t.release(),a}catch(e){throw console.error("Błąd zapytania do bazy danych:",e),e}}}};var r=require("../../../webpack-runtime.js");r.C(e);var __webpack_exec__=e=>r(r.s=e),t=r.X(0,[955],()=>__webpack_exec__(27772));module.exports=t})();