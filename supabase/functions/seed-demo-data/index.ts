import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Create demo users
    const demoUsers = [
      { email: "client@demo.com", password: "demo1234", name: "Sarah Chen", company: "Apex Motors", phone: "+971 50 123 4567", role: "client" as const },
      { email: "client2@demo.com", password: "demo1234", name: "James Whitfield", company: "Fairway Co.", phone: "+971 55 987 6543", role: "client" as const },
      { email: "admin@demo.com", password: "demo1234", name: "Undercat Admin", company: "Undercat Creatives", phone: "", role: "admin" as const },
    ];

    const userIds: Record<string, string> = {};

    for (const u of demoUsers) {
      // Check if user exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((eu: any) => eu.email === u.email);

      let userId: string;
      if (existing) {
        userId = existing.id;
      } else {
        const { data, error } = await supabase.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
        });
        if (error) throw new Error(`Failed to create user ${u.email}: ${error.message}`);
        userId = data.user.id;
      }

      userIds[u.email] = userId;

      // Update profile
      await supabase.from("profiles").upsert({
        id: userId,
        name: u.name,
        company: u.company,
        email: u.email,
        phone: u.phone,
      });

      // Set role
      await supabase.from("user_roles").upsert(
        { user_id: userId, role: u.role },
        { onConflict: "user_id,role" }
      );
    }

    // Create projects
    const projectsData = [
      {
        title: "Black Series Launch",
        category: "Automotive",
        objective: "Launch campaign for new Black Series model — build anticipation and drive showroom visits.",
        current_phase: "Production",
        status: "on-track" as const,
        start_date: "2026-02-01",
        target_date: "2026-04-15",
        scope_bundle: "Signature Package",
        audience: "High-intent luxury car buyers, 30–55",
        channels: ["Instagram", "YouTube", "LED Screen", "Website"],
        style_direction: "Cinematic, premium, restrained drama",
        lead_contact: "Omar K. — Creative Director",
        recent_activity: ["Hero film shoot completed — March 3", "Cutdown storyboards approved — March 1", "Moodboard v2 signed off — Feb 25"],
        revision_included: 2,
        revision_used: 0,
        client_email: "client@demo.com",
      },
      {
        title: "Spring Collection Drop",
        category: "Golf / Lifestyle",
        objective: "Content package for new spring apparel collection — drive awareness and e-commerce traffic.",
        current_phase: "Post-Production",
        status: "waiting-approval" as const,
        start_date: "2026-01-15",
        target_date: "2026-03-20",
        scope_bundle: "Starter Sprint",
        audience: "Newer golfers, 25–40, style-conscious",
        channels: ["Instagram Reels", "TikTok", "Website"],
        style_direction: "Clean, confident, approachable. Not elitist.",
        lead_contact: "Lina M. — Producer",
        recent_activity: ["Edit v2 delivered for review — March 5", "Stills retouching complete — March 3", "Shoot wrap — Feb 28"],
        revision_included: 2,
        revision_used: 1,
        client_email: "client2@demo.com",
      },
      {
        title: "Grand Opening — Noor Kitchen",
        category: "Restaurant / F&B",
        objective: "Launch visuals for new restaurant opening — drive reservations and social buzz.",
        current_phase: "Pre-Production",
        status: "in-progress" as const,
        start_date: "2026-02-20",
        target_date: "2026-04-01",
        scope_bundle: "Signature Package",
        audience: "Local food lovers, 25–45, experience-driven",
        channels: ["Instagram", "TikTok", "Google Business", "In-Venue"],
        style_direction: "Warm, appetizing, atmospheric. Memory over information.",
        lead_contact: "Omar K. — Creative Director",
        recent_activity: ["Moodboard shared — March 4", "Kickoff call completed — Feb 25", "Contract signed + deposit received — Feb 22"],
        revision_included: 2,
        revision_used: 0,
        client_email: "client@demo.com",
      },
      {
        title: "Summer Fest 2026 — Promo Package",
        category: "Events / Concerts",
        objective: "Promo visuals for summer music festival — sell tickets and build excitement.",
        current_phase: "Delivery",
        status: "delivered" as const,
        start_date: "2025-12-01",
        target_date: "2026-02-15",
        scope_bundle: "Black Panther Package",
        audience: "Music fans, 18–35, social-first",
        channels: ["Instagram", "TikTok", "YouTube", "Outdoor Billboards"],
        style_direction: "Bold, energetic, memorable. Festival energy with production value.",
        lead_contact: "Lina M. — Producer",
        recent_activity: ["All final files delivered — Feb 14", "Final approval received — Feb 12", "Edit v2 approved — Feb 10"],
        revision_included: 2,
        revision_used: 2,
        client_email: "client2@demo.com",
      },
    ];

    // Clear existing data
    await supabase.from("next_steps").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("briefs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("files").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("reviews").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("deliverables").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("timeline_phases").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("user_projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const projectIds: string[] = [];

    for (const p of projectsData) {
      const { client_email, ...projectRow } = p;
      const { data: proj, error } = await supabase.from("projects").insert(projectRow).select("id").single();
      if (error) throw new Error(`Failed to create project ${p.title}: ${error.message}`);
      projectIds.push(proj.id);

      // Link client
      const clientId = userIds[client_email];
      await supabase.from("user_projects").insert({ user_id: clientId, project_id: proj.id });
    }

    // Timeline phases for each project
    const allTimelines = [
      // Project 0: Black Series Launch
      [
        { name: "Discovery", status: "completed", owner: "Undercat", target_date: "2026-02-07", notes: "Kickoff + brief alignment complete.", sort_order: 0 },
        { name: "Pre-Production", status: "completed", owner: "Undercat", target_date: "2026-02-21", notes: "Moodboards, storyboards, location scout done.", sort_order: 1 },
        { name: "Production", status: "in-progress", owner: "Undercat", target_date: "2026-03-14", notes: "Principal photography in progress.", sort_order: 2 },
        { name: "Post-Production", status: "not-started", owner: "Undercat", target_date: "2026-03-28", notes: "", sort_order: 3 },
        { name: "Review", status: "not-started", owner: "Client", target_date: "2026-04-04", notes: "", sort_order: 4 },
        { name: "Delivery", status: "not-started", owner: "Undercat", target_date: "2026-04-10", notes: "", sort_order: 5 },
        { name: "Launch", status: "not-started", owner: "Both", target_date: "2026-04-15", notes: "", sort_order: 6 },
      ],
      // Project 1: Spring Collection Drop
      [
        { name: "Discovery", status: "completed", owner: "Undercat", target_date: "2026-01-22", notes: "Brief aligned.", sort_order: 0 },
        { name: "Pre-Production", status: "completed", owner: "Undercat", target_date: "2026-02-07", notes: "Shot list and styling confirmed.", sort_order: 1 },
        { name: "Production", status: "completed", owner: "Undercat", target_date: "2026-02-28", notes: "Shoot complete.", sort_order: 2 },
        { name: "Post-Production", status: "in-progress", owner: "Undercat", target_date: "2026-03-10", notes: "Edit v2 delivered. Awaiting feedback.", sort_order: 3 },
        { name: "Review", status: "waiting", owner: "Client", target_date: "2026-03-14", notes: "Feedback needed by March 14.", blocker: "Client approval pending", sort_order: 4 },
        { name: "Delivery", status: "not-started", owner: "Undercat", target_date: "2026-03-18", notes: "", sort_order: 5 },
        { name: "Launch", status: "not-started", owner: "Both", target_date: "2026-03-20", notes: "", sort_order: 6 },
      ],
      // Project 2: Noor Kitchen
      [
        { name: "Discovery", status: "completed", owner: "Undercat", target_date: "2026-02-28", notes: "Kickoff done.", sort_order: 0 },
        { name: "Pre-Production", status: "in-progress", owner: "Undercat", target_date: "2026-03-14", notes: "Moodboards in review. Menu shoot list pending.", sort_order: 1 },
        { name: "Production", status: "not-started", owner: "Undercat", target_date: "2026-03-21", notes: "", sort_order: 2 },
        { name: "Post-Production", status: "not-started", owner: "Undercat", target_date: "2026-03-28", notes: "", sort_order: 3 },
        { name: "Review", status: "not-started", owner: "Client", target_date: "2026-03-30", notes: "", sort_order: 4 },
        { name: "Delivery", status: "not-started", owner: "Undercat", target_date: "2026-03-31", notes: "", sort_order: 5 },
        { name: "Launch", status: "not-started", owner: "Both", target_date: "2026-04-01", notes: "", sort_order: 6 },
      ],
      // Project 3: Summer Fest
      [
        { name: "Discovery", status: "completed", owner: "Undercat", target_date: "2025-12-10", notes: "", sort_order: 0 },
        { name: "Pre-Production", status: "completed", owner: "Undercat", target_date: "2025-12-28", notes: "", sort_order: 1 },
        { name: "Production", status: "completed", owner: "Undercat", target_date: "2026-01-18", notes: "", sort_order: 2 },
        { name: "Post-Production", status: "completed", owner: "Undercat", target_date: "2026-02-01", notes: "", sort_order: 3 },
        { name: "Review", status: "completed", owner: "Client", target_date: "2026-02-10", notes: "", sort_order: 4 },
        { name: "Delivery", status: "completed", owner: "Undercat", target_date: "2026-02-14", notes: "", sort_order: 5 },
        { name: "Launch", status: "completed", owner: "Both", target_date: "2026-02-15", notes: "Launched on time.", sort_order: 6 },
      ],
    ];

    for (let i = 0; i < projectIds.length; i++) {
      const rows = allTimelines[i].map((t) => ({ ...t, project_id: projectIds[i] }));
      await supabase.from("timeline_phases").insert(rows);
    }

    // Deliverables
    const allDeliverables = [
      [
        { name: "Hero Film (60s)", quantity: 1, status: "in-progress", notes: "Shoot wrapped. Edit starting." },
        { name: "Cutdowns (15s)", quantity: 3, status: "not-started", notes: "After hero edit locks." },
        { name: "Campaign Stills", quantity: 8, status: "in-progress", notes: "Selects in review." },
        { name: "LED Screen Adapts", quantity: 2, status: "not-started", notes: "" },
        { name: "BTS Reels", quantity: 4, status: "in-progress", notes: "Captured on set." },
      ],
      [
        { name: "Collection Hero Reel (30s)", quantity: 1, status: "in-review", notes: "v2 ready for review." },
        { name: "Product Reels", quantity: 4, status: "in-review", notes: "Delivered with hero edit." },
        { name: "Lifestyle Stills", quantity: 12, status: "delivered", notes: "Retouched and delivered." },
        { name: "Social Cutdowns", quantity: 6, status: "in-progress", notes: "Being cut from hero footage." },
      ],
      [
        { name: "Menu Highlight Reel", quantity: 1, status: "not-started", notes: "" },
        { name: "Atmosphere Film (30s)", quantity: 1, status: "not-started", notes: "" },
        { name: "Food Stills", quantity: 15, status: "not-started", notes: "" },
        { name: "Social Teaser Reels", quantity: 5, status: "not-started", notes: "" },
        { name: "In-Venue Display Adapts", quantity: 3, status: "not-started", notes: "" },
      ],
      [
        { name: "Promo Film (45s)", quantity: 1, status: "delivered", notes: "" },
        { name: "Artist Announce Reels", quantity: 6, status: "delivered", notes: "" },
        { name: "Event Stills", quantity: 10, status: "delivered", notes: "" },
        { name: "Billboard Adapts", quantity: 4, status: "delivered", notes: "" },
        { name: "Social Countdown Pack", quantity: 8, status: "delivered", notes: "" },
      ],
    ];

    for (let i = 0; i < projectIds.length; i++) {
      const rows = allDeliverables[i].map((d) => ({ ...d, project_id: projectIds[i] }));
      await supabase.from("deliverables").insert(rows);
    }

    // Reviews
    const allReviews = [
      [
        { title: "Hero Film — Rough Cut", version: 1, approval_type: "approve-direction", due_date: "2026-03-20", status: "pending", review_link: "#", feedback_submitted: false },
        { title: "Campaign Stills — Selects", version: 1, approval_type: "approve-edit", due_date: "2026-03-12", status: "in-review", review_link: "#", feedback_submitted: false },
      ],
      [
        { title: "Hero Reel — Edit v2", version: 2, approval_type: "approve-edit", due_date: "2026-03-14", status: "in-review", review_link: "#", feedback_submitted: false },
        { title: "Product Reels — Full Set", version: 1, approval_type: "approve-direction", due_date: "2026-03-14", status: "in-review", review_link: "#", feedback_submitted: false },
      ],
      [],
      [
        { title: "Promo Film — Final", version: 2, approval_type: "approve-final", due_date: "2026-02-10", status: "approved", review_link: "#", feedback_submitted: true },
      ],
    ];

    for (let i = 0; i < projectIds.length; i++) {
      if (allReviews[i].length > 0) {
        const rows = allReviews[i].map((r) => ({ ...r, project_id: projectIds[i] }));
        await supabase.from("reviews").insert(rows);
      }
    }

    // Files
    const allFiles = [
      [
        { title: "Project Blueprint", type: "document", version: "v1.0", file_updated_at: "2026-02-05", status: "Final", url: "#" },
        { title: "Moodboard v2", type: "reference", version: "v2", file_updated_at: "2026-02-25", status: "Approved", url: "#" },
        { title: "Storyboard — Hero Film", type: "reference", version: "v1", file_updated_at: "2026-02-20", status: "Approved", url: "#" },
        { title: "Still Selects — Round 1", type: "review", version: "v1", file_updated_at: "2026-03-06", status: "In Review", url: "#" },
      ],
      [
        { title: "Project Blueprint", type: "document", version: "v1.0", file_updated_at: "2026-01-18", status: "Final", url: "#" },
        { title: "Shot List & Styling Notes", type: "reference", version: "v1", file_updated_at: "2026-02-05", status: "Approved", url: "#" },
        { title: "Lifestyle Stills — Final", type: "final", version: "v1", file_updated_at: "2026-03-03", status: "Delivered", url: "#" },
        { title: "Hero Reel — Edit v2", type: "review", version: "v2", file_updated_at: "2026-03-05", status: "In Review", url: "#" },
      ],
      [
        { title: "Project Blueprint", type: "document", version: "v1.0", file_updated_at: "2026-02-22", status: "Final", url: "#" },
        { title: "Moodboard — Noor Kitchen", type: "reference", version: "v1", file_updated_at: "2026-03-04", status: "In Review", url: "#" },
      ],
      [
        { title: "Project Blueprint", type: "document", version: "v1.0", file_updated_at: "2025-12-05", status: "Final", url: "#" },
        { title: "Promo Film — Final Cut", type: "final", version: "v2", file_updated_at: "2026-02-14", status: "Delivered", url: "#" },
        { title: "Artist Reels — Full Set", type: "final", version: "v1", file_updated_at: "2026-02-14", status: "Delivered", url: "#" },
        { title: "Billboard Artwork — All Sizes", type: "final", version: "v1", file_updated_at: "2026-02-14", status: "Delivered", url: "#" },
        { title: "Social Pack — Countdown Assets", type: "final", version: "v1", file_updated_at: "2026-02-14", status: "Delivered", url: "#" },
      ],
    ];

    for (let i = 0; i < projectIds.length; i++) {
      const rows = allFiles[i].map((f) => ({ ...f, project_id: projectIds[i] }));
      await supabase.from("files").insert(rows);
    }

    // Briefs
    const allBriefs = [
      {
        objective: "Launch campaign for the new Black Series — build anticipation and drive showroom visits.",
        audience: "High-intent luxury car buyers, 30–55",
        deliverables: ["Hero Film (60s)", "3× Cutdowns (15s)", "8× Campaign Stills", "2× LED Adapts", "4× BTS Reels"],
        channels: ["Instagram", "YouTube", "LED Screen", "Website"],
        style_direction: "Cinematic, premium, restrained drama. Think tension before reveal.",
        constraints: ["Fixed launch date: April 15", "Brand guidelines provided"],
        package: "Signature Package",
        revision_terms: "2 revision rounds included. Directional changes may require a change order.",
      },
      {
        objective: "Content package for spring apparel collection — drive awareness and e-commerce traffic.",
        audience: "Newer golfers, 25–40, style-conscious",
        deliverables: ["1× Hero Reel (30s)", "4× Product Reels", "12× Lifestyle Stills", "6× Social Cutdowns"],
        channels: ["Instagram Reels", "TikTok", "Website"],
        style_direction: "Clean, confident, approachable. Aspirational without being elitist.",
        constraints: ["Collection drop date: March 20", "E-commerce assets needed by March 18"],
        package: "Starter Sprint",
        revision_terms: "2 revision rounds included. 1 used so far.",
      },
      {
        objective: "Launch visuals for new restaurant opening — drive reservations and social buzz.",
        audience: "Local food lovers, 25–45, experience-driven",
        deliverables: ["1× Menu Highlight Reel", "1× Atmosphere Film", "15× Food Stills", "5× Social Teasers", "3× In-Venue Adapts"],
        channels: ["Instagram", "TikTok", "Google Business", "In-Venue"],
        style_direction: "Warm, appetizing, atmospheric. Memory over information.",
        constraints: ["Opening date: April 1", "Menu finalization pending from client"],
        package: "Signature Package",
        revision_terms: "2 revision rounds included.",
      },
      {
        objective: "Promo visuals for summer music festival — sell tickets and build excitement.",
        audience: "Music fans, 18–35, social-first",
        deliverables: ["1× Promo Film (45s)", "6× Artist Announce Reels", "10× Event Stills", "4× Billboard Adapts", "8× Social Countdown Pack"],
        channels: ["Instagram", "TikTok", "YouTube", "Outdoor Billboards"],
        style_direction: "Bold, energetic, memorable. Festival energy with production value.",
        constraints: ["Ticket launch: Feb 15", "Artist lineup confirmed by Dec 20"],
        package: "Black Panther Package",
        revision_terms: "2 revision rounds included. Both used.",
      },
    ];

    for (let i = 0; i < projectIds.length; i++) {
      await supabase.from("briefs").insert({ ...allBriefs[i], project_id: projectIds[i] });
    }

    // Next steps
    const allNextSteps = [
      [
        { title: "Review still selects and confirm top 8", owner: "client", due_date: "2026-03-12", status: "pending", notes: "Selects shared via review link." },
        { title: "Deliver hero film rough cut", owner: "undercat", due_date: "2026-03-20", status: "in-progress", notes: "Edit starting this week." },
        { title: "Confirm LED screen specs", owner: "client", due_date: "2026-03-15", status: "pending", notes: "Need exact dimensions from venue." },
      ],
      [
        { title: "Review hero reel v2 and product reels", owner: "client", due_date: "2026-03-14", status: "pending", notes: "Consolidated feedback preferred." },
        { title: "Finalize social cutdowns", owner: "undercat", due_date: "2026-03-16", status: "in-progress", notes: "" },
        { title: "Deliver final export package", owner: "undercat", due_date: "2026-03-18", status: "pending", notes: "After final approval." },
      ],
      [
        { title: "Approve moodboard direction", owner: "client", due_date: "2026-03-10", status: "pending", notes: "Moodboard shared via portal." },
        { title: "Send finalized menu for shoot planning", owner: "client", due_date: "2026-03-12", status: "pending", notes: "" },
        { title: "Confirm shoot dates and venue access", owner: "undercat", due_date: "2026-03-14", status: "in-progress", notes: "" },
      ],
      [
        { title: "Project complete — archive files", owner: "undercat", due_date: "2026-02-20", status: "completed", notes: "All assets delivered." },
      ],
    ];

    for (let i = 0; i < projectIds.length; i++) {
      const rows = allNextSteps[i].map((n) => ({ ...n, project_id: projectIds[i] }));
      await supabase.from("next_steps").insert(rows);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Demo data seeded successfully", projectIds, userIds }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
