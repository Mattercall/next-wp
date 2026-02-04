const response = await fetch("/api/woo/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    payment_method: "cod", // or your gateway id
    billing_address: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      company: formData.company,
      address_1: formData.address1,
      address_2: formData.address2,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      country: formData.country,
      email: formData.email,
      phone: formData.phone,
    },
    // for digital: just copy billing -> shipping (or your API can do it automatically)
    shipping_address: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      company: formData.company,
      address_1: formData.address1,
      address_2: formData.address2,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      country: formData.country,
    },
    customer_note: formData.notes,
  }),
});
