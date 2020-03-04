export const parseCategories = (categories, extraMargin) => {
  return categories.map(category => {
    let cheapestItem = category.get("cheapestItem");
    cheapestItem = extraMargin
      ? Math.round(cheapestItem * extraMargin + cheapestItem)
      : cheapestItem;

    return {
      title: category.get("name"),
      itemCount: category.get("productsCount"),
      minPrice: cheapestItem,
      imageSrc: category.get("imageSrc").replace(/\\/g, ""),
      handle: category.get("categoryHandle")
    };
  });
};

export const parseTreats = treats => {
  return treats.map(treat => {
    return {
      title: treat.get("productName"),
      imageSrc: treat.get("productImageSrc"),
      orderNumber: treat.get("orderNumber"),
      price: treat.get("orderCost"),
      date: treat.get("createdAt"),
      variant: treat.get("variantTitle")
    };
  });
};

export const parseProducts = (products, extraMargin) => {
  return products.map(product => {
    let minProductPrice = Math.round(
      (product.node.priceRange.minVariantPrice.amount / 2) * 1000
    );
    let maxProductPrice = Math.round(
      (product.node.priceRange.maxVariantPrice.amount / 2) * 1000
    );

    minProductPrice = extraMargin
      ? Math.round(minProductPrice * extraMargin + minProductPrice)
      : minProductPrice;
    maxProductPrice = extraMargin
      ? Math.round(maxProductPrice * extraMargin + maxProductPrice)
      : maxProductPrice;

    return {
      title: product.node.title,
      imageSrc: product.node.images.edges[0].node.transformedSrc,
      handle: product.node.handle,
      minPrice: minProductPrice,
      maxPrice: maxProductPrice,
      cursor: product.cursor
    };
  });
};

export const parseVariants = (variants, extraMargin) => {
  const filteredVariants = variants.filter(variant => {
    return variant.node.availableForSale === true;
  });

  const parsedVariants = filteredVariants.map(variant => {
    let variantPrice = Math.round((variant.node.price / 2) * 1000);
    variantPrice = extraMargin
      ? Math.round(variantPrice * extraMargin + variantPrice)
      : variantPrice;

    return {
      imageSrc: variant.node.image.transformedSrc,
      price: variantPrice,
      options: variant.node.selectedOptions,
      sku: variant.node.sku
    };
  });

  switchOptionsIfNeeded(parsedVariants);

  return parsedVariants;
};

const switchOptionsIfNeeded = variants => {
  if (variants[0].options.length > 1) {
    if (variants[0].options[1].name.toLowerCase().includes("color")) {
      variants.forEach(variant => {
        const tempOption = variant.options[0];
        variant.options[0] = variant.options[1];
        variant.options[1] = tempOption;
      });
    }
  }
};

export const parseProductInfo = (productInfo, extraMargin) => {
  let minVariantPrice = Math.round(
    (productInfo.priceRange.minVariantPrice.amount / 2) * 1000
  );
  let maxVariantPrice = Math.round(
    (productInfo.priceRange.maxVariantPrice.amount / 2) * 1000
  );

  minVariantPrice = extraMargin
    ? Math.round(minVariantPrice * extraMargin + minVariantPrice)
    : minVariantPrice;
  maxVariantPrice = extraMargin
    ? Math.round(maxVariantPrice * extraMargin + maxVariantPrice)
    : maxVariantPrice;

  return {
    title: productInfo.title,
    imageSrc: productInfo.images.edges[0].node.transformedSrc,
    minVariantPrice: minVariantPrice,
    maxVariantPrice: maxVariantPrice
  };
};
