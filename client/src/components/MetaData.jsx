import { Helmet } from 'react-helmet-async';

const MetaData = ({ title, description, keywords }) => {


  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
    </Helmet>
  )
};

MetaData.defaultprops = {
    title: 'Welcome to Gr8life',
    description: 'Globally competitive products that promote health, beauty and wellness',
    keywords: 'health, beauty, wellness, nutrition, ecommerce'
}

export default MetaData;