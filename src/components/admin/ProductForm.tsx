import { useState, type FormEvent } from "react";
import type { Product, ProductLevel, PerfumeCategory } from "../../types/product";
import type { CategoryRow, ProductInput } from "../../lib/products";
import { createProduct, updateProduct, uploadProductImage } from "../../lib/products";
import { slugify } from "../../lib/slugify";

interface ProductFormProps {
  product: Product | null;
  categories: CategoryRow[];
  onSaved: () => void;
  onCancel: () => void;
}

const LEVELS: ProductLevel[] = ["principiante", "intermedio", "avanzado"];

export function ProductForm({ product, categories, onSaved, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [categorySlug, setCategorySlug] = useState<PerfumeCategory>(
    product?.category ?? categories[0]?.slug ?? "arabe",
  );
  const [concentration, setConcentration] = useState(product?.concentration ?? "Eau de Parfum");
  const [size, setSize] = useState(product?.size ?? "100 ml");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [previousPrice, setPreviousPrice] = useState(
    product?.previousPrice != null ? String(product.previousPrice) : "",
  );
  const [stock, setStock] = useState(String(product?.stock ?? 0));
  const [sku, setSku] = useState(product?.sku ?? "");
  const [level, setLevel] = useState<ProductLevel | "">(product?.level ?? "");
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [visible, setVisible] = useState(product?.visible ?? true);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [gallery, setGallery] = useState<string[]>(product?.gallery ?? []);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const effectiveSlug = slugTouched ? slug : slugify(name);

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    setError(null);
    try {
      const url = await uploadProductImage(file, effectiveSlug || "producto");
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    setUploadingGallery(true);
    setError(null);
    try {
      const uploads = await Promise.all(
        Array.from(files).map((file) => uploadProductImage(file, effectiveSlug || "producto")),
      );
      setGallery((prev) => [...prev, ...uploads]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la galería.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (url: string) => {
    setGallery((prev) => prev.filter((item) => item !== url));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) {
      setError("Elegí una categoría válida.");
      return;
    }

    const parsedPrice = Number(price);
    if (!name.trim() || !brand.trim() || !effectiveSlug || Number.isNaN(parsedPrice)) {
      setError("Completá nombre, marca y precio.");
      return;
    }

    const input: ProductInput = {
      slug: effectiveSlug,
      brand: brand.trim(),
      name: name.trim(),
      categoryId: category.id,
      concentration: concentration.trim(),
      size: size.trim(),
      price: parsedPrice,
      previousPrice: previousPrice ? Number(previousPrice) : null,
      badge: badge.trim() || null,
      sku: sku.trim() || null,
      stock: Number(stock) || 0,
      level: level || null,
      description: description.trim() || null,
      imageUrl: imageUrl || null,
      gallery,
      visible,
    };

    setSubmitting(true);
    try {
      if (product) {
        await updateProduct(product.id, input);
      } else {
        await createProduct(input);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el producto.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal">
      <form className="admin-modal__card" onSubmit={handleSubmit}>
        <h2 className="admin-modal__title">{product ? "Editar producto" : "Nuevo producto"}</h2>

        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Nombre</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className="admin-field">
            <span>Slug (URL)</span>
            <input
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
            />
          </label>

          <label className="admin-field">
            <span>Marca</span>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} required />
          </label>

          <label className="admin-field">
            <span>Categoría</span>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value as PerfumeCategory)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Concentración</span>
            <input value={concentration} onChange={(e) => setConcentration(e.target.value)} />
          </label>

          <label className="admin-field">
            <span>Tamaño</span>
            <input value={size} onChange={(e) => setSize(e.target.value)} />
          </label>

          <label className="admin-field">
            <span>Precio (USD)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>

          <label className="admin-field">
            <span>Precio anterior (oferta)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={previousPrice}
              onChange={(e) => setPreviousPrice(e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>Stock</span>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>SKU</span>
            <input value={sku} onChange={(e) => setSku(e.target.value)} />
          </label>

          <label className="admin-field">
            <span>Nivel</span>
            <select value={level} onChange={(e) => setLevel(e.target.value as ProductLevel | "")}>
              <option value="">—</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Badge (opcional)</span>
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Nuevo, Bestseller…"
            />
          </label>
        </div>

        <label className="admin-field">
          <span>Descripción</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <div className="admin-field">
          <span>Imagen principal</span>
          {imageUrl && <img src={imageUrl} alt="Vista previa" className="admin-image-preview" />}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
          />
          {uploadingCover && <p className="admin-hint">Subiendo…</p>}
        </div>

        <div className="admin-field">
          <span>Galería (opcional)</span>
          <div className="admin-gallery">
            {gallery.map((url) => (
              <div key={url} className="admin-gallery__item">
                <img src={url} alt="" />
                <button type="button" onClick={() => removeGalleryImage(url)}>
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)}
          />
          {uploadingGallery && <p className="admin-hint">Subiendo…</p>}
        </div>

        <label className="admin-field admin-field--row">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
          />
          <span>Visible en la tienda</span>
        </label>

        {error && <p className="admin-auth__error">{error}</p>}

        <div className="admin-modal__actions">
          <button type="button" className="btn btn-outline btn-outline--dark" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
