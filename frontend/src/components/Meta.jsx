import { Helmet } from "react-helmet-async";

export default function Meta({ title, description, keywords }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}

Meta.defaultProps = {
  title: "歡迎來到網站",
  description: "賣最好的產品",
  keywords: "各類產品",
};
