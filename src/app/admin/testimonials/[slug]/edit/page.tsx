import { AdminTestimonialForm } from "@/components/admin/AdminTestimonialForm";
type Props = { params: Promise<{ slug: string }> };
export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <AdminTestimonialForm mode="edit" slug={slug} />;
}
