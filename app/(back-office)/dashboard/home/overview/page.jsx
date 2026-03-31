// import CurrentStock from '@/components/dashboard/CurrentStock';
// import DashboardBanner from '@/components/dashboard/DashboardBanner';
// import SalesOverview from '@/components/dashboard/SalesOverview';
// import UnverifiedToastNotifier from '@/components/dashboard/UnverifiedToastNotifier';
// import { getData } from '@/lib/getData';
// import React from 'react'




// export const revalidate = 60; // cache for 60 seconds


// // export default async function Dashboard() 
// // { const items = await getData("items")
// //    return ( 
// //    <div>

// // <UnverifiedToastNotifier/>

// //      <DashboardBanner/>
// //       <SalesOverview/> 
// //    <CurrentStock/>

   


  
// //         </div> ); }

// import { db } from "@/lib/db";

// export default async function Dashboard() {
//   const items = await db.item.findMany({
//     orderBy: { createdAt: "desc" },
//   });

//   return (
//     <div>
//       <UnverifiedToastNotifier />
//       <DashboardBanner />
//       <SalesOverview />
//       <CurrentStock items={items} />
//     </div>
//   );
// }


import CurrentStock from '@/components/dashboard/CurrentStock';
import DashboardBanner from '@/components/dashboard/DashboardBanner';
import SalesOverview from '@/components/dashboard/SalesOverview';
import UnverifiedToastNotifier from '@/components/dashboard/UnverifiedToastNotifier';
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic'; // ✅ prevents prerender DB fetch
export const revalidate = 60; // optional caching

export default async function Dashboard() {
  const items = await db.item.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <UnverifiedToastNotifier />
      <DashboardBanner />
      <SalesOverview />
      <CurrentStock items={items} />
    </div>
  );
}