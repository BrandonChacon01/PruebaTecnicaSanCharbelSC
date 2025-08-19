// OBTENER NOTICIAS DE TECNOLOGÍA
export const getTechNews = async (req, res) => {
  try {
    const response = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/technology/rss.xml'
    );
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error al consultar API de noticias de tecnología' });
    }
    
    const data = await response.json();
    
    const articles = data.items?.map(item => ({
      title: item.title,
      description: item.description?.replace(/<[^>]*>/g, ''),
      url: item.link,
      urlToImage: item.enclosure?.link || item.thumbnail,
      publishedAt: item.pubDate,
      source: {
        name: 'BBC Technology'
      },
      content: item.content
    })) || [];
    
    const limitedArticles = articles.slice(0, 15);

    res.json({ 
      message: 'Noticias de tecnología obtenidas exitosamente',
      count: limitedArticles.length, 
      results: limitedArticles 
    });
  } catch (error) {
    console.error('Error en getTechNews:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
