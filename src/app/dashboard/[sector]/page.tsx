import SectorDashboard from "@/components/SectorDashboard";

export default async function SectorPage({ 
  params 
}: { 
  params: Promise<{ sector: string }> 
}) {
  // For demo, all users are premium. In production, check auth session
  const isPremium = true;
  const { sector } = await params;
  
  return (
    <SectorDashboard 
      sectorSlug={sector} 
      isPremium={isPremium}
    />
  );
}
