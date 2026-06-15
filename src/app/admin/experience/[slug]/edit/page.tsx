import { AdminExperienceForm } from "@/components/admin/AdminExperienceForm";
type Props = { params: Promise<{ slug: string }> };
export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <AdminExperienceForm mode="edit" slug={slug} />;
}
