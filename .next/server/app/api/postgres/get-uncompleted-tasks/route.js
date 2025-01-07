"use strict";(()=>{var e={};e.id=551,e.ids=[551],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},61872:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>l,originalPathname:()=>k,requestAsyncStorage:()=>u,routeModule:()=>d,serverHooks:()=>c,staticGenerationAsyncStorage:()=>p,staticGenerationBailout:()=>_});var s={};r.r(s),r.d(s,{POST:()=>POST}),r(78976);var a=r(10884),o=r(16132),i=r(46837),n=r(95798);let POST=async e=>{try{let t=await e.json(),{firebase_id:r}=t,s=`
            SELECT 
                tk.id AS id, 
                tk.list_id AS list_id, 
                tk.title AS title, 
                tk.description AS description, 
                tk.due_date AS due_date, 
                tk.is_completed AS is_completed, 
                tk.created_at AS created_at, 
                tk.updated_at AS updated_at 
            FROM 
                task_lists tl
            LEFT JOIN 
                tasks tk
            ON 
                tl.id = tk.list_id
            LEFT JOIN 
                users usr
            ON
                usr.id = tl.user_id
            WHERE 
                usr.firebase_id = $1;
        `,a=await (0,i.J)(s,[r]);return n.Z.json({tasks:a.rows},{status:200})}catch(e){return console.error("Error fetching reminders:",e),n.Z.json({error:"Error fetching reminders"},{status:500})}},d=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/postgres/get-uncompleted-tasks/route",pathname:"/api/postgres/get-uncompleted-tasks",filename:"route",bundlePath:"app/api/postgres/get-uncompleted-tasks/route"},resolvedPagePath:"C:\\Users\\STW\\OneDrive\\Dokumenty\\VSC Projects\\Tasker-For-Firebase\\app\\api\\postgres\\get-uncompleted-tasks\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:u,staticGenerationAsyncStorage:p,serverHooks:c,headerHooks:l,staticGenerationBailout:_}=d,k="/api/postgres/get-uncompleted-tasks/route"},46837:(e,t,r)=>{r.d(t,{J:()=>executeQuery});let s=require("pg"),a={user:process.env.DB_USER,password:process.env.DB_PASSWORD,host:process.env.DB_HOST,database:process.env.DB_NAME,port:parseInt(process.env.DB_PORT,10),ssl:!1},o=new s.Pool(a);async function executeQuery(e,t){try{let r=await o.connect(),s=await r.query(e,t);return r.release(),s}catch(e){throw console.error("Błąd zapytania do bazy danych:",e),e}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[955],()=>__webpack_exec__(61872));module.exports=r})();