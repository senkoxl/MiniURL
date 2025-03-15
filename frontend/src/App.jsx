import { useState } from "react";

function App() {
  const [url, setUrl] = useState(""); // URL input state
  const [shortUrl, setShortUrl] = useState(""); // Short URL state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message state
  const [copied, setCopied] = useState(false); // State to track if URL was copied

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit
    setError(""); // Reset error message
    setShortUrl(""); // Reset short URL

    if (!url.trim()) return; // Don't submit if URL is empty

    setIsLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:3000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url_original: url }),
      });

      if (!response.ok) {
        throw new Error("URL no válida");
      }

      const data = await response.json();
      setShortUrl(data.shortUrl); // Set shortened URL
    } catch (error) {
      setError("Hubo un error al acortar la URL. Asegúrate de que sea válida.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="container">
      <h1>Acortador de URLs</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingresa la URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Acortar URL</button>
        {isLoading && <div className="loader"></div>}
        {shortUrl && (
        <div className={`message success acortada`}>
          <p>
            URL acortada:{" "}
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="acortada"
            >
              {shortUrl}
            </a>
          </p>
          <button onClick={handleCopy} className={`copy-btn ${copied ? "copied" : ""}`}>
            {copied ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      )}

      {error && <div className="message error">{error}</div>}
      </form>

      
    </div>
  );
}

export default App;
