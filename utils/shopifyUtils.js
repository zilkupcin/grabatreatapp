import { SHOPIFY_ACCESS_TOKEN } from "react-native-dotenv";

export const buildCategoryProductRequest = (
  cursor,
  handle,
  sortMode,
  signal
) => {
  return {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN,
      "Content-Type": "application/graphql"
    },
    signal: signal,
    body:
      cursor != undefined
        ? buildQueryNextPage(handle, sortMode, cursor)
        : buildQueryWithHandle(handle, sortMode)
  };
};

export const buildProductDetailsRequest = (handle, signal) => {
  return {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN,
      "Content-Type": "application/graphql"
    },
    signal: signal,
    body: buildQueryDetails(handle)
  };
};

const buildQueryWithHandle = (handle, sortMode) => {
  return `query Products {
	collectionByHandle(handle: "${handle}"){
    products(first: 20, sortKey: ${
      sortMode === 0 || sortMode === 1 ? "PRICE" : "CREATED"
    }, reverse: ${sortMode === 1 ? true : false}){
      pageInfo{
        hasNextPage
      }edges{
        cursor
        node {
          descriptionHtml
          title
          createdAt
          handle
          id
          priceRange{
            minVariantPrice{
              amount
            }
            maxVariantPrice{
              amount
            }
          }
          images(first: 1){
            edges{
              node{
                transformedSrc(maxWidth: 512, maxHeight: 512)
              }
            }
          }
        }
      }
    }
  }
}`;
};

const buildQueryNextPage = (handle, sortMode, cursor) => {
  return `query Products {
	collectionByHandle(handle: "${handle}"){
    products(first: 20, sortKey: ${
      sortMode === 0 || sortMode === 1 ? "PRICE" : "CREATED"
    },reverse: ${sortMode === 1 ? true : false}, after: "${cursor}"){
      pageInfo{
        hasNextPage
      }edges{
        cursor
        node {
          descriptionHtml
          title
          createdAt
          handle
          id
          priceRange{
            minVariantPrice{
              amount
            }
            maxVariantPrice{
              amount
            }
          }
          images(first: 1){
            edges{
              node{
                transformedSrc(maxWidth: 512, maxHeight: 512)
              }
            }
          }
        }
      }
    }
  }
}`;
};

const buildQueryDetails = handle => {
  return `{
  productByHandle(handle: "${handle}"){
    title
    tags
    descriptionHtml
    priceRange{
      minVariantPrice{
        amount
      }
      maxVariantPrice{
        amount
      }
    }
    variants(first: 100){
      edges{
        node{
          sku,
          price,
          availableForSale,
          image{
            transformedSrc(maxWidth: 512, maxHeight: 512)
          }
          selectedOptions{
            value,
            name
          }
        }
      }
    }
    images(first: 1){
      edges{
        node{
          transformedSrc(maxWidth: 512, maxHeight: 512)
        }
      }
    }
  }
}`;
};

export const filterProductDetails = htmlDescription => {
  const usefulFragments = [
    "Material:",
    "Metals Type:",
    "Band Material Type:",
    "Dial Window Material Type:",
    "Case Material:",
    "Band Length:",
    "Band Width:",
    "Dial Diameter:",
    "Scarves Length:",
    "Frame Material:",
    "Lenses Material:",
    "Lens Width:",
    "Lens Height:",
    "Main Material:",
    "Lining Material:",
    "Texture of material:",
    "Product Size:",
    "Earring Type:"
  ];

  htmlDescription = htmlDescription.replace(/<p>/g, "");
  htmlDescription = htmlDescription.replace(/<\/p>/g, "");
  const elements = htmlDescription.split("<br>");

  const filteredElements = elements.filter(element => {
    return usefulFragments.find(fragment => element.includes(fragment));
  });
  return filteredElements
    .map((element, index) => {
      if (index !== filteredElements.length - 1) {
        return element + "<br>";
      } else {
        return element;
      }
    })
    .join("");
};
