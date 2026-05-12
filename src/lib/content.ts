import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteContent {
  general: {
    orgName: string;
    shortName: string;
    tagline: string;
    footerText: string;
    logoText: string;
    ifcLink: string;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    mission: string;
    vision: string;
    history: string;
    ceoMessage: string;
    ceoName: string;
  };
  home: {
    operationsTitle: string;
    operationsDescription: string;
    cards: Array<{ title: string; description: string }>;
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
      ifcProfile: string;
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
      maxSpeed: string;
      range: string;
      crew: string;
      isGeneric: boolean;
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
      aircraft: string;
      type: string;
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
      image: string;
      runways: string;
      elevation: string;
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
      requirements: string;
      perks: string;
      flightHours: string;
    }>;
  };
  apply: {
    title: string;
    subtitle: string;
    description: string;
    requirements: string[];
    positions: string[];
    ifcLink: string;
    discordLink: string;
  };
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const defaultContent: SiteContent = {
  general: {
    orgName: "Indian Air Force Virtual Organisation",
    shortName: "IAFVO",
    tagline: "Guardians of the Virtual Skies",
    footerText: "© 2026 Indian Air Force Virtual Organisation. All rights reserved. This is a virtual aviation organization and is not affiliated with the real Indian Air Force.",
    logoText: "IAFVO",
    ifcLink: "https://community.infiniteflight.com",
  },
  about: {
    title: "About IAFVO",
    subtitle: "Excellence in Virtual Aviation",
    description: "The Indian Air Force Virtual Organisation (IAFVO) is a premier virtual aviation community dedicated to simulating the operations, discipline, and professionalism of the Indian Air Force within Infinite Flight.",
    mission: "To create the most authentic and professional virtual representation of the Indian Air Force, fostering a community of passionate aviation enthusiasts who uphold the values of discipline, precision, and camaraderie. We strive to deliver realistic military procedures, structured training, and an immersive experience for every member.",
    vision: "To be the leading virtual air force organization in the global Infinite Flight community, recognized for operational excellence, realistic procedures, and an unwavering commitment to authenticity. We aim to inspire the next generation of virtual aviators through structured growth and military-grade discipline.",
    history: "Founded by a group of dedicated flight simulation enthusiasts, IAFVO has grown into a thriving community of virtual pilots who share a common passion for Indian military aviation. Our journey began with a small team committed to building something extraordinary in the Infinite Flight virtual aviation world.",
    ceoMessage: "Welcome to the Indian Air Force Virtual Organisation. As the Chief of Air Staff, I am proud to lead a community built on the pillars of discipline, precision, and excellence. IAFVO is more than just a virtual airline — it is a brotherhood of aviators committed to the highest standards of virtual military aviation. Whether you are a seasoned pilot or just beginning your journey, there is a place for you here. Jai Hind.",
    ceoName: "Air Chief Marshal — Chief of Air Staff, IAFVO",
  },
  home: {
    operationsTitle: "Our Operations",
    operationsDescription: "IAFVO conducts a wide range of virtual military operations within Infinite Flight, including combat air patrols, strategic airlift missions, formation flying exercises, and joint training sorties. Our structured squadron system ensures every pilot is assigned meaningful roles and regular missions, maintaining the discipline and operational tempo of a real air force.",
    cards: [
      { title: "Discipline", description: "Military-grade standards, structured procedures, and a chain of command that mirrors real air force operations." },
      { title: "Precision", description: "Authentic flight operations, realistic ATC procedures, and rigorous training programs for all pilots." },
      { title: "Community", description: "A brotherhood of virtual aviators united by a shared passion for Indian military aviation on Infinite Flight." },
      { title: "Operations", description: "Nationwide virtual route network, patrol sorties, airlift missions, and regular joint training exercises." },
    ],
  },
  staff: {
    title: "Our Staff",
    subtitle: "Command Structure",
    members: [
      { name: "Air Chief Marshal Vikram Singh", rank: "Air Chief Marshal", position: "Chief of Air Staff", image: "", bio: "Leading IAFVO with over 5 years of virtual aviation experience.", ifcProfile: "https://community.infiniteflight.com" },
      { name: "Air Marshal Rajesh Kumar", rank: "Air Marshal", position: "Vice Chief of Air Staff", image: "", bio: "Overseeing operations and training across all squadrons.", ifcProfile: "https://community.infiniteflight.com" },
      { name: "Air Vice Marshal Priya Sharma", rank: "Air Vice Marshal", position: "Director of Operations", image: "", bio: "Managing flight operations and route planning.", ifcProfile: "https://community.infiniteflight.com" },
      { name: "Group Captain Arjun Patel", rank: "Group Captain", position: "Head of Training", image: "", bio: "Responsible for pilot training and certification programs.", ifcProfile: "https://community.infiniteflight.com" },
      { name: "Wing Commander Deepak Nair", rank: "Wing Commander", position: "Chief of Communications", image: "", bio: "Managing community engagement and external relations.", ifcProfile: "https://community.infiniteflight.com" },
    ],
  },
  fleet: {
    title: "Our Fleet",
    subtitle: "Aircraft Inventory",
    aircraft: [
      { name: "Sukhoi Su-30MKI", type: "Fighter", role: "Air Superiority", image: "", specs: "Twin-engine, supermaneuverable multirole fighter aircraft. The backbone of the IAF fighter fleet.", maxSpeed: "Mach 2.0", range: "3,000 km", crew: "2", isGeneric: false },
      { name: "HAL Tejas", type: "Fighter", role: "Multirole", image: "", specs: "Single-engine, lightweight multirole fighter developed indigenously by HAL.", maxSpeed: "Mach 1.8", range: "1,850 km", crew: "1", isGeneric: false },
      { name: "Dassault Rafale", type: "Fighter", role: "Omnirole", image: "", specs: "Twin-engine, canard delta wing multirole fighter with advanced avionics.", maxSpeed: "Mach 1.8", range: "3,700 km", crew: "1-2", isGeneric: false },
      { name: "C-17 Globemaster III", type: "Transport", role: "Strategic Airlift", image: "", specs: "Large military transport aircraft capable of rapid strategic delivery.", maxSpeed: "833 km/h", range: "8,700 km", crew: "3", isGeneric: false },
      { name: "Boeing C-130J Super Hercules", type: "Transport", role: "Tactical Airlift", image: "", specs: "Four-engine turboprop military transport for tactical operations.", maxSpeed: "643 km/h", range: "6,852 km", crew: "5", isGeneric: false },
      { name: "Boeing 737 AEW&C", type: "Special Mission", role: "Airborne Early Warning", image: "", specs: "Airborne early warning and control aircraft with 360° radar coverage.", maxSpeed: "853 km/h", range: "7,400 km", crew: "12", isGeneric: false },
    ],
  },
  routes: {
    title: "Our Routes",
    subtitle: "Operational Sorties",
    routeList: [
      { from: "VIDP (Hindon)", to: "VABB (Mumbai)", distance: "1,148 km", frequency: "Daily", aircraft: "C-17 Globemaster III", type: "Strategic Airlift" },
      { from: "VOBL (Bangalore)", to: "VECC (Kolkata)", distance: "1,560 km", frequency: "Daily", aircraft: "Su-30MKI", type: "Combat Air Patrol" },
      { from: "VIDP (Hindon)", to: "VEGT (Guwahati)", distance: "1,500 km", frequency: "3x Weekly", aircraft: "C-130J Super Hercules", type: "Tactical Airlift" },
      { from: "VAJJ (Jamnagar)", to: "VOBL (Bangalore)", distance: "1,200 km", frequency: "2x Weekly", aircraft: "HAL Tejas", type: "Combat Air Patrol" },
      { from: "VIDP (Hindon)", to: "VISR (Srinagar)", distance: "650 km", frequency: "Daily", aircraft: "Su-30MKI", type: "Patrol Sortie" },
      { from: "VABB (Mumbai)", to: "VOHY (Hyderabad)", distance: "620 km", frequency: "Daily", aircraft: "C-130J Super Hercules", type: "Supply Run" },
    ],
  },
  hubs: {
    title: "Our Hubs",
    subtitle: "Strategic Air Bases",
    hubList: [
      { name: "Air Force Station Hindon", code: "VIDP", location: "Ghaziabad, Uttar Pradesh", type: "Primary Hub", description: "Headquarters and primary operations base for IAFVO. The largest air force station in Asia, home to our command staff and primary training squadrons.", image: "", runways: "2 (09/27, 10/28)", elevation: "717 ft" },
      { name: "Air Force Station Pune", code: "VAPO", location: "Pune, Maharashtra", type: "Secondary Hub", description: "Western region operations and training center. Hosts our transport wing and serves as a key logistics base for western sector operations.", image: "", runways: "1 (08/26)", elevation: "1,942 ft" },
      { name: "Air Force Station Kalaikunda", code: "VEDX", location: "West Bengal", type: "Regional Hub", description: "Eastern region operations base. Critical to our eastern sector patrol routes and serves as the gateway for northeastern operations.", image: "", runways: "1 (09/27)", elevation: "61 ft" },
      { name: "Air Force Station Jodhpur", code: "VIJO", location: "Jodhpur, Rajasthan", type: "Regional Hub", description: "Desert region operations and combat training. Home to our fighter squadrons and a key base for western border patrol sorties.", image: "", runways: "2 (05/23, 16/34)", elevation: "896 ft" },
    ],
  },
  ranks: {
    title: "Rank Structure",
    subtitle: "IAFVO Hierarchy",
    rankList: [
      { rank: "Air Chief Marshal", category: "Air Officers", description: "Chief of the Air Staff and highest operational authority within IAFVO.", insignia: "", requirements: "Appointment by the founding committee. Reserved for the CEO/founder.", perks: "Full administrative authority, access to all channels, sets VO policy.", flightHours: "500+" },
      { rank: "Air Marshal", category: "Air Officers", description: "Senior command officer responsible for overseeing all wings and operations.", insignia: "", requirements: "300+ flight hours, minimum 12 months active service, exemplary record.", perks: "Wing command authority, staff appointment rights, access to admin dashboard.", flightHours: "300+" },
      { rank: "Air Vice Marshal", category: "Air Officers", description: "Division commander overseeing multiple squadrons and sector operations.", insignia: "", requirements: "200+ flight hours, 9 months active service, squadron command experience.", perks: "Division command, training syllabus approval, event coordination authority.", flightHours: "200+" },
      { rank: "Air Commodore", category: "Air Officers", description: "Station commander responsible for a specific air base and its squadrons.", insignia: "", requirements: "150+ flight hours, 6 months active service, proven leadership record.", perks: "Station command, recruit intake authority, base event hosting rights.", flightHours: "150+" },
      { rank: "Group Captain", category: "Senior Officers", description: "Wing or group commander leading multiple flight operations.", insignia: "", requirements: "100+ flight hours, 4 months active service, Flight Lieutenant minimum.", perks: "Flight scheduling, junior officer mentoring, route recommendation rights.", flightHours: "100+" },
      { rank: "Wing Commander", category: "Senior Officers", description: "Squadron senior — leads and coordinates a full squadron.", insignia: "", requirements: "75+ flight hours, 3 months active service, positive peer reviews.", perks: "Squadron leadership, mission briefing rights, event participation priority.", flightHours: "75+" },
      { rank: "Squadron Leader", category: "Senior Officers", description: "Flight commander leading a sub-unit of pilots on sorties.", insignia: "", requirements: "50+ flight hours, 2 months active service.", perks: "Flight lead authority, sortie planning access, mentoring new pilots.", flightHours: "50+" },
      { rank: "Flight Lieutenant", category: "Junior Officers", description: "Experienced pilot qualified to lead formation flights.", insignia: "", requirements: "25+ flight hours, 6 weeks active service, passed advanced training.", perks: "Formation lead privileges, access to advanced sortie types.", flightHours: "25+" },
      { rank: "Flying Officer", category: "Junior Officers", description: "Fully qualified pilot authorized for independent solo sorties.", insignia: "", requirements: "10+ flight hours, passed basic training evaluation.", perks: "Solo sortie authorization, access to all standard routes.", flightHours: "10+" },
      { rank: "Pilot Officer", category: "Junior Officers", description: "Entry-level commissioned officer. New recruit undergoing initial training.", insignia: "", requirements: "Complete the application process and be accepted into IAFVO.", perks: "Access to training sorties, community membership, mentoring from senior officers.", flightHours: "0" },
    ],
  },
  apply: {
    title: "Join IAFVO",
    subtitle: "Begin Your Service",
    description: "Are you ready to serve in the Indian Air Force Virtual Organisation? We are looking for dedicated virtual pilots who share our passion for realistic military aviation simulation on Infinite Flight. To apply, message us on the IFC or post in our IFC thread.",
    requirements: [
      "Be at least 13 years of age",
      "Be Grade 3 or above in Infinite Flight",
      "Own a legal copy of Infinite Flight",
      "Have an IFC (Infinite Flight Community) account in good standing",
      "Do not appear on the IFVARB blacklist",
      "Be able to complete at least one flight per month",
      "Respectful and disciplined attitude",
    ],
    positions: [
      "Fighter Pilot",
      "Transport Pilot",
      "Special Mission Pilot",
      "Training Officer",
      "Ground Operations Staff",
    ],
    ifcLink: "https://community.infiniteflight.com",
    discordLink: "",
  },
};

// ─── Supabase helpers ─────────────────────────────────────────────────────────

const ROW_ID = 1;

function mergeWithDefaults(raw: unknown): SiteContent {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return defaultContent;
  const obj = raw as Record<string, unknown>;
  if (Object.keys(obj).length === 0) return defaultContent;
  return {
    general:  { ...defaultContent.general,  ...(obj.general  as object || {}) },
    about:    { ...defaultContent.about,    ...(obj.about    as object || {}) },
    home: {
      ...defaultContent.home,
      ...(obj.home as object || {}),
      cards: Array.isArray((obj.home as Record<string,unknown>)?.cards)
        ? (obj.home as Record<string,unknown>).cards as SiteContent['home']['cards']
        : defaultContent.home.cards,
    },
    staff: {
      ...defaultContent.staff,
      ...(obj.staff as object || {}),
      members: Array.isArray((obj.staff as Record<string,unknown>)?.members)
        ? (obj.staff as Record<string,unknown>).members as SiteContent['staff']['members']
        : defaultContent.staff.members,
    },
    fleet: {
      ...defaultContent.fleet,
      ...(obj.fleet as object || {}),
      aircraft: Array.isArray((obj.fleet as Record<string,unknown>)?.aircraft)
        ? (obj.fleet as Record<string,unknown>).aircraft as SiteContent['fleet']['aircraft']
        : defaultContent.fleet.aircraft,
    },
    routes: {
      ...defaultContent.routes,
      ...(obj.routes as object || {}),
      routeList: Array.isArray((obj.routes as Record<string,unknown>)?.routeList)
        ? (obj.routes as Record<string,unknown>).routeList as SiteContent['routes']['routeList']
        : defaultContent.routes.routeList,
    },
    hubs: {
      ...defaultContent.hubs,
      ...(obj.hubs as object || {}),
      hubList: Array.isArray((obj.hubs as Record<string,unknown>)?.hubList)
        ? (obj.hubs as Record<string,unknown>).hubList as SiteContent['hubs']['hubList']
        : defaultContent.hubs.hubList,
    },
    ranks: {
      ...defaultContent.ranks,
      ...(obj.ranks as object || {}),
      rankList: Array.isArray((obj.ranks as Record<string,unknown>)?.rankList)
        ? (obj.ranks as Record<string,unknown>).rankList as SiteContent['ranks']['rankList']
        : defaultContent.ranks.rankList,
    },
    apply: {
      ...defaultContent.apply,
      ...(obj.apply as object || {}),
      requirements: Array.isArray((obj.apply as Record<string,unknown>)?.requirements)
        ? (obj.apply as Record<string,unknown>).requirements as string[]
        : defaultContent.apply.requirements,
      positions: Array.isArray((obj.apply as Record<string,unknown>)?.positions)
        ? (obj.apply as Record<string,unknown>).positions as string[]
        : defaultContent.apply.positions,
    },
  };
}

export async function fetchContent(): Promise<SiteContent> {
  try {
    const { data, error } = await supabase
      .from('site_data')
      .select('content')
      .eq('id', ROW_ID)
      .single();
    if (error) throw error;
    return mergeWithDefaults(data?.content);
  } catch (e) {
    console.error('[IAFVO] fetchContent error:', e);
    return defaultContent;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  const { error } = await supabase
    .from('site_data')
    .upsert({ id: ROW_ID, content }, { onConflict: 'id' });
  if (error) throw error;
}

// ─── React Context ────────────────────────────────────────────────────────────

import { type ReactNode } from 'react';
import React from 'react';

interface ContentCtx {
  content: SiteContent;
  loading: boolean;
  refresh: () => void;
}

const ContentContext = createContext<ContentCtx>({
  content: defaultContent,
  loading: false,
  refresh: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchContent().then(c => {
      setContent(c);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();

    const channel = supabase
      .channel('site_data_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_data', filter: `id=eq.${ROW_ID}` },
        (payload) => {
          setContent(mergeWithDefaults(payload.new?.content));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return React.createElement(ContentContext.Provider, { value: { content, loading, refresh: load } }, children);
}

export function useContent() {
  return useContext(ContentContext);
}

export function getContent(): SiteContent {
  return defaultContent;
}
