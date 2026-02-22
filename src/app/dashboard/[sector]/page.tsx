import SectorDashboard from "@/components/SectorDashboard";

export default function SectorPage({ 
  params 
}: { 
  params: Promise<{ sector: string }> 
}) {
  // For demo, all users are premium. In production, check auth session
  const isPremium = true;
  
  return (
    <SectorDashboard 
      sectorSlug={(params as any).sector} 
      isPremium={isPremium}
    />
  );
}
