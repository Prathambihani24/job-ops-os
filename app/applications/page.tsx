'use client';

 import { supabase } from '@/lib/supabase';
 import { useEffect, useState } from 'react';
 import { ApplicationTracker, JobOpportunity } from '@/types';

 export default function ApplicationsPage() {
   const [user, setUser] = useState<any>(null);
   const [applications, setApplications] = useState<ApplicationTracker[]>([]);
   const [jobs, setJobs] = useState<JobOpportunity[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedStatus, setSelectedStatus] = useState('all');

   // Mock jobs for demo
   const mockJobs = [
     { id: '1', title: 'GTM Engineer - Growth Platform', company: 'GrowthLoop', matchScore: 85 },
     { id: '2', title: 'Solutions Engineer - CRM', company: 'Salesforce Partner', matchScore: 70 },
     { id: '3', title: 'RevOps Engineer - Subscription', company: 'Chargebee', matchScore: 65 },
   ];

   useEffect(() => {
     const getUser = async () => {
       const { data } = await supabase.auth.getUser();
       setUser(data.user);
     };

     getUser();

     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       setUser(session?.user ?? null);
     });

     return () => subscription.unsubscribe();
   }, []);

   useEffect(() => {
     if (!user) return;

     // Fetch applications
     const fetchApps = async () => {
       const { data } = await supabase
         .from('applications')
         .select('*,job:title,company,gtmAlignmentScore')
         .eq('userId', user.id);

       if (data) {
         const enriched = data.map((app) => ({
           ...app,
           jobTitle: app.job?.title || 'Unknown',
           company: app.job?.company || 'Unknown',
           matchScore: app.job?.gtmAlignmentScore || 0,
         }));
         setApplications(enriched);
       }
     };

     // Fetch jobs for creation
     const fetchJobs = async () => {
       const { data } = await supabase.from('jobs').select('*');
       if (data) setJobs(data);
     };

     fetchApps();
     fetchJobs();
   }, [user]);

   const handleStatusChange = async (appId: string, newStatus: string) => {
     try {
       const { error } = await supabase
         .from('applications')
         .update({ status: newStatus, updated_at: new Date().toISOString() })
         .eq('id', appId);

       if (error) throw error;

       setApplications((prev) =>
         prev.map((app) =>
           app.id === appId ? { ...app, status: newStatus as any } : app
         )
       );

       // Check for follow-up needs
       if (newStatus === 'interviewing') {
         const app = applications.find((a) => a.id === appId);
         if (app) {
           // Set reminder for interview prep
           await supabase.from('notifications').insert({
             userId: user!.id,
             type: 'interview_reminder',
             message: `Interview prep needed for ${app.jobTitle} at ${app.company}`,
             scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
           });
         }
       }
     } catch (error) {
       console.error('Status update failed:', error);
     }
   };

   const handleNewApplication = async (jobId: string) => {
     try {
       const { error } = await supabase.from('applications').insert({
         userId: user!.id,
         jobId,
         status: 'applied',
         appliedDate: new Date().toISOString(),
       });

       if (error) throw error;

       alert('Application created successfully!');
       // Refresh applications
       const { data } = await supabase
         .from('applications')
         .select('*')
         .eq('userId', user.id);
       if (data) setApplications(data);
     } catch (error) {
       alert('Error creating application: ' + error);
     }
   };

   const filteredApps = applications.filter((app) =>
     selectedStatus === 'all' || app.status === selectedStatus
   );

   return (
     <div className="p-6">
       <h1 className="text-2xl font-bold mb-2">Application Tracker</h1>
       <p className="mb-6 text-sm text-slate-500">Manage your job applications and follow-up reminders.</p>

       {/* Status Filters */}
       <div className="flex gap-2 mb-6">
         {['all', 'saved', 'applied', 'interviewing', 'offer'].map((status) => (
           <button
             key={status}
             onClick={() => setSelectedStatus(status)}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
               selectedStatus === status
                 ? 'bg-indigo-600 text-white'
                 : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
             }`}
           >
             {status.charAt(0).toUpperCase() + status.slice(1)}
           </button>
         ))}
       </div>

       {/* Create New Application */}
       <div className="mb-6 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
         <h3 className="font-semibold text-indigo-900 mb-2">📝 New Application</h3>
         <div className="flex gap-3 items-center">
           <select className="flex-1 px-4 py-2 border border-slate-300 rounded-lg">
             <option value="">Select a job...</option>
             {jobs.map((job) => (
               <option key={job.id} value={job.id}>
                 {job.title} - {job.company}
               </option>
             ))}
           </select>
           <button
             onClick={() => {
               const select = document.querySelector('select') as HTMLSelectElement;
               if (select.value) handleNewApplication(select.value);
             }}
             className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
           >
             Apply
           </button>
         </div>
       </div>

       {/* Application Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {filteredApps.map((app) => (
           <div
             key={app.id}
             className="border border-slate-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
           >
             <div className="flex items-start justify-between mb-3">
               <h3 className="font-semibold text-lg">{app.jobTitle}</h3>
               <span
                 className={`text-xs px-2 py-1 rounded-full font-medium ${
                   app.status === 'saved'
                     ? 'bg-slate-100 text-slate-700'
                     : app.status === 'applied'
                     ? 'bg-blue-100 text-blue-700'
                     : app.status === 'interviewing'
                     ? 'bg-green-100 text-green-700'
                     : app.status === 'offer'
                     ? 'bg-purple-100 text-purple-700'
                     : 'bg-red-100 text-red-700'
                 }`}
               >
                 {app.status}
               </span>
             </div>
             <p className="text-sm text-slate-600 mb-2">{app.company}</p>
             <div className="text-xs text-slate-500 mb-4">
               Applied: {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}
             </div>

             {/* Status Actions */}
             <div className="flex gap-2">
               {app.status === 'saved' && (
                 <button
                   onClick={() => handleStatusChange(app.id, 'applied')}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                 >
                   Mark Applied
                 </button>
               )}
               {app.status === 'applied' && (
                 <button
                   onClick={() => handleStatusChange(app.id, 'interviewing')}
                   className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                 >
                   Mark Interviewing
                 </button>
               )}
               {app.status === 'interviewing' && (
                 <button
                   onClick={() => handleStatusChange(app.id, 'offer')}
                   className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700"
                 >
                   Mark Offer
                 </button>
               )}
             </div>
           </div>
         ))}
       </div>

       {filteredApps.length === 0 && (
         <div className="text-center py-12 text-slate-500">
           No applications found for this status.
         </div>
       )}
     </div>
   );
 }