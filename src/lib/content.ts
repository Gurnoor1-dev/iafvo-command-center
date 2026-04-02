import { supabase } from './supabase';

export interface SiteContent {
  general: {
    orgName: string;
    shortName: string;
    tagline: string;
    footerText: string;
    logoText: string;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    mission: string;
    vision: string;
    history: string;
  };
  staff: {
    title: string;
    subtitle: string;
    members: Array<{
      name: string;
      rank: string;
      position: string;
      image: string;
      bio: string;
    }>;
  };
  fleet: {
    title: string;
    subtitle: string;
    aircraft: Array<{
      name: string;
      type: string;
      role: string;
      image: string;
      specs: string;
    }>;
  };
  routes: {
    title: string;
    subtitle: string;
    routeList: Array<{
      from: string;
      to: string;
      distance: string;
      frequency: string;
    }>;
  };
  hubs: {
    title: string;
    subtitle: string;
    hubList: Array<{
      name: string;
      code: string;
      location: string;
      type: string;
      description: string;
    }>;
  };
  ranks: {
    title: string;
    subtitle: string;
    rankList: Array<{
      rank: string;
      category: string;
      description: string;
      insignia: string;
    }>;
  };
  apply: {
    title: string;
    subtitle: string;
    description: string;
    requirements: string[];
    positions: string[];
    discordLink: string;
  };
}

export const defaultContent: SiteContent = {
  general: {
    orgName: "Indian Air Force Virtual Organisation",
    shortName: "IAFVO",
    tagline: "Guardians of the Virtual Skies",
    footerText: "© 2024 Indian Air Force Virtual Organisation. All rights reserved. This is a virtual aviation organization and is not affiliated with the real Indian Air Force.",
    logoText: "IAFVO",
  },
  about: {
    title: "About IAFVO",
    subtitle: "Excellence in Virtual Aviation",
    description: "The Indian Air Force Virtual Organisation (IAFVO) is a premier virtual aviation community dedicated to simulating the operations, discipline, and professionalism of the Indian Air Force.",
    mission: "To create the most authentic and professional virtual representation of the Indian Air Force, fostering a community of passionate aviation enthusiasts who uphold the values of discipline, precision, and camaraderie.",
    vision: "To be the leading virtual air force organization in the global flight simulation community, recognized for operational excellence, realistic procedures, and an unwavering commitment to authenticity.",
    history: "Founded by a group of dedicated flight simulation enthusiasts, IAFVO has grown into a thriving community of virtual pilots who share a common passion for Indian military aviation.",
  },
  staff: {
    title: "Our Staff",
    subtitle: "Command Structure",
    members: [
      { name: "Air Chief Marshal Vikram Singh", rank: "Air Chief Marshal", position: "Chief of Air Staff", image: "", bio: "Leading IAFVO with over 5 years of virtual aviation experience." },
      { name: "Air Marshal Rajesh Kumar", rank: "Air Marshal", position: "Vice Chief of Air Staff", image: "", bio: "Overseeing operations and training across all squadrons." },
      { name: "Air Vice Marshal Priya Sharma", rank: "Air Vice Marshal", position: "Director of Operations", image: "", bio: "Managing flight operations and route planning." },
      { name: "Group Captain Arjun Patel", rank: "Group Captain", position: "Head of Training", image: "", bio: "Responsible for pilot training and certification programs." },
      { name: "Wing Commander Deepak Nair", rank: "Wing Commander", position: "Chief of Communications", image: "", bio: "Managing community engagement and external relations." },
    ],
  },
  fleet: {
    title: "Our Fleet",
    subtitle: "Aircraft Inventory",
    aircraft: [
      { name: "Sukhoi Su-30MKI", type: "Fighter", role: "Air Superiority", image: "", specs: "Twin-engine, supermaneuverable fighter aircraft" },
      { name: "HAL Tejas", type: "Fighter", role: "Multirole", image: "", specs: "Single-engine, lightweight multirole fighter" },
      { name: "Dassault Rafale", type: "Fighter", role: "Omnirole", image: "", specs: "Twin-engine, canard delta wing multirole fighter" },
      { name: "C-17 Globemaster III", type: "Transport", role: "Strategic Airlift", image: "", specs: "Large military transport aircraft" },
      { name: "Boeing C-130J Super Hercules", type: "Transport", role: "Tactical Airlift", image: "", specs: "Four-engine turboprop military transport" },
      { name: "Boeing 737 AEW&C", type: "Special Mission", role: "Airborne Early Warning", image: "", specs: "Airborne early warning and control aircraft" },
    ],
  },
  routes: {
    title: "Our Routes",
    subtitle: "Operational Network",
    routeList: [
      { from: "VIDP (Delhi)", to: "VABB (Mumbai)", distance: "1,148 km", frequency: "Daily" },
      { from: "VOBL (Bangalore)", to: "VECC (Kolkata)", distance: "1,560 km", frequency: "Daily" },
      { from: "VIDP (Delhi)", to: "VEGT (Guwahati)", distance: "1,500 km", frequency: "3x Weekly" },
      { from: "VAJJ (Jamnagar)", to: "VOBL (Bangalore)", distance: "1,200 km", frequency: "2x Weekly" },
      { from: "VIDP (Delhi)", to: "VISR (Srinagar)", distance: "650 km", frequency: "Daily" },
      { from: "VABB (Mumbai)", to: "VOHY (Hyderabad)", distance: "620 km", frequency: "Daily" },
      { from: "VECC (Kolkata)", to: "VIDP (Delhi)", distance: "1,305 km", frequency: "Daily" },
      { from: "VOBL (Bangalore)", to: "VOCI (Kochi)", distance: "340 km", frequency: "4x Weekly" },
    ],
  },
  hubs: {
    title: "Our Hubs",
    subtitle: "Strategic Air Bases",
    hubList: [
      { name: "Air Force Station Hindon", code: "VIDP", location: "Ghaziabad, Uttar Pradesh", type: "Primary Hub", description: "Headquarters and primary operations base for IAFVO." },
      { name: "Air Force Station Pune", code: "VAPO", location: "Pune, Maharashtra", type: "Secondary Hub", description: "Western region operations and training center." },
      { name: "Air Force Station Kalaikunda", code: "VEDX", location: "West Bengal", type: "Regional Hub", description: "Eastern region operations base." },
      { name: "Air Force Station Jodhpur", code: "VIJO", location: "Jodhpur, Rajasthan", type: "Regional Hub", description: "Desert region operations and combat training." },
    ],
  },
  ranks: {
    title: "Rank Structure",
    subtitle: "IAFVO Hierarchy",
    rankList: [
      { rank: "Marshal of the Air Force", category: "Air Officers", description: "Five-star rank, honorary wartime rank", insignia: "" },
      { rank: "Air Chief Marshal", category: "Air Officers", description: "Chief of the Air Staff", insignia: "" },
      { rank: "Air Marshal", category: "Air Officers", description: "Senior commanding officer", insignia: "" },
      { rank: "Air Vice Marshal", category: "Air Officers", description: "Division commander", insignia: "" },
      { rank: "Air Commodore", category: "Air Officers", description: "Station commander", insignia: "" },
      { rank: "Group Captain", category: "Senior Officers", description: "Wing or group commander", insignia: "" },
      { rank: "Wing Commander", category: "Senior Officers", description: "Squadron leader senior", insignia: "" },
      { rank: "Squadron Leader", category: "Senior Officers", description: "Squadron commander", insignia: "" },
      { rank: "Flight Lieutenant", category: "Junior Officers", description: "Flight commander", insignia: "" },
      { rank: "Flying Officer", category: "Junior Officers", description: "Qualified pilot", insignia: "" },
      { rank: "Pilot Officer", category: "Junior Officers", description: "Entry-level commissioned officer", insignia: "" },
    ],
  },
  apply: {
    title: "Join IAFVO",
    subtitle: "Begin Your Service",
    description: "Are you ready to serve in the Indian Air Force Virtual Organisation? We are looking for dedicated virtual pilots who share our passion for realistic military aviation simulation.",
    requirements: [
      "Must be at least 16 years of age",
      "Must own a copy of a compatible flight simulator",
      "Basic understanding of aviation and flight procedures",
      "Ability to commit to regular training sessions",
      "Working microphone for voice communications",
      "Respectful and disciplined attitude",
    ],
    positions: [
      "Fighter Pilot",
      "Transport Pilot",
      "Helicopter Pilot",
      "Air Traffic Controller",
      "Ground Operations Staff",
    ],
    discordLink: "https://discord.gg/iafvo",
  },
};

const SUPABASE_ROW_ID = 1;

/** Fetch content from Supabase. Falls back to defaultContent on error. */
export async function fetchContent(): Promise<SiteContent> {
  try {
    const { data, error } = await supabase
      .from('site_data')
      .select('content')
      .eq('id', SUPABASE_ROW_ID)
      .single();
    if (error) throw error;
    if (data?.content) return data.content as SiteContent;
  } catch (e) {
    console.warn('Failed to fetch from Supabase, using defaults:', e);
  }
  return defaultContent;
}

/** Push content to Supabase (upsert so the row is created if missing). */
export async function saveContent(content: SiteContent): Promise<void> {
  const { error } = await supabase
    .from('site_data')
    .upsert({ id: SUPABASE_ROW_ID, content }, { onConflict: 'id' });
  if (error) throw error;
}

// ─── React hook ────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent().then(c => { setContent(c); setLoading(false); });

    // Real-time subscription — any UPDATE on site_data triggers a refresh
    const channel = supabase
      .channel('site_data_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_data', filter: `id=eq.${SUPABASE_ROW_ID}` },
        (payload) => {
          if (payload.new?.content) setContent(payload.new.content as SiteContent);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { content, loading };
}

// Legacy sync getter — returns cached default; pages should use useContent() hook instead
export function getContent(): SiteContent {
  return defaultContent;
}
