import { useEffect, useState } from "react";
import { ProductForm } from "../../../components/admin/ProductForm";
import {
  deleteProduct,
  fetchAdminProducts,
  fetchCategories,
  type CategoryRow,
} from "../../../lib/products";
import type { Product } from "../../../types/product";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  const reload = async () => {
    setLoading(true);
    const [productsData, categoriesData] = await Promise.all([
      fetchAdminProducts(),
      fetchCategories(),
    ]);
    setProducts(productsData);
    setCategories(categoriesData);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    await deleteProduct(product.id);
    reload();
  };

  return (
    <div className="admin-panel">
      <div className="admin__toolbar">
        <h2>Productos</h2>
        <button className="btn btn-primary" onClick={() => setEditing("new")}>
          + Nuevo producto
        </button>
      </div>

      {loading ? (
        <p className="admin-hint">Cargando…</p>
      ) : products.length === 0 ? (
        <p className="admin-hint">Todavía no hay productos cargados.</p>
      ) : (
        <div className="admin-table">
          {products.map((product) => (
            <div key={product.id} className="admin-row">
              <div className="admin-row__media">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="" />
                ) : (
                  <div className="admin-row__media-placeholder" />
                )}
              </div>

              <div className="admin-row__info">
                <p className="admin-row__name">{product.name}</p>
                <p className="admin-row__meta">
                  {product.brand} · {product.category}
                </p>
              </div>

              <div className="admin-row__price">
                {currency.format(product.price)}
                {product.previousPrice && (
                  <span className="admin-row__price-prev">
                    {currency.format(product.previousPrice)}
                  </span>
                )}
              </div>

              <div className="admin-row__stock">{product.stock ?? 0} en stock</div>

              <div className="admin-row__visible">{product.visible ? "Visible" : "Oculto"}</div>

              <div className="admin-row__actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setEditing(product)}
                >
                  Editar
                </button>
                <button className="admin-row__delete" onClick={() => handleDelete(product)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          categories={categories}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </div>
  );
}
