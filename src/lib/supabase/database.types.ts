export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_products: {
        Row: {
          bundle_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          bundle_id: string
          product_id: string
          quantity?: number
        }
        Update: {
          bundle_id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "bundle_products_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
        ]
      }
      bundles: {
        Row: {
          bundle_price: number
          created_at: string
          description_ar: string | null
          description_en: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name_ar: string
          name_en: string
        }
        Insert: {
          bundle_price: number
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_ar: string
          name_en: string
        }
        Update: {
          bundle_price?: number
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_ar?: string
          name_en?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          converted_order_id: string | null
          coupon_code: string | null
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          converted_order_id?: string | null
          coupon_code?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          converted_order_id?: string | null
          coupon_code?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_converted_order_id_fkey"
            columns: ["converted_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name_ar: string
          name_en: string
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_products: {
        Row: {
          collection_id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          collection_id: string
          product_id: string
          sort_order?: number
        }
        Update: {
          collection_id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          card_size: string
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          name_ar: string
          name_en: string
          placement: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          card_size?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_ar?: string
          name_en?: string
          placement?: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          card_size?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_ar?: string
          name_en?: string
          placement?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          min_order_amount: number | null
          used_count: number
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          used_count?: number
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      delivery_areas: {
        Row: {
          created_at: string
          delivery_fee: number
          free_delivery_threshold: number | null
          governorate_id: string
          id: string
          is_active: boolean
          is_configured: boolean
          name_ar: string
          name_en: string
        }
        Insert: {
          created_at?: string
          delivery_fee?: number
          free_delivery_threshold?: number | null
          governorate_id: string
          id?: string
          is_active?: boolean
          is_configured?: boolean
          name_ar: string
          name_en: string
        }
        Update: {
          created_at?: string
          delivery_fee?: number
          free_delivery_threshold?: number | null
          governorate_id?: string
          id?: string
          is_active?: boolean
          is_configured?: boolean
          name_ar?: string
          name_en?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_areas_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          expense_date: string
          id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_ar: string
          answer_en: string
          created_at: string
          id: string
          is_active: boolean
          question_ar: string
          question_en: string
          sort_order: number
        }
        Insert: {
          answer_ar: string
          answer_en: string
          created_at?: string
          id?: string
          is_active?: boolean
          question_ar: string
          question_en: string
          sort_order?: number
        }
        Update: {
          answer_ar?: string
          answer_en?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question_ar?: string
          question_en?: string
          sort_order?: number
        }
        Relationships: []
      }
      governorates: {
        Row: {
          created_at: string
          id: string
          name_ar: string
          name_en: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
        }
        Update: {
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
        }
        Relationships: []
      }
      manual_customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          bundle_id: string | null
          created_at: string
          id: string
          is_bundle_component: boolean
          order_id: string
          product_id: string | null
          product_name_ar: string
          product_name_en: string
          quantity: number
          unit_cost: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          bundle_id?: string | null
          created_at?: string
          id?: string
          is_bundle_component?: boolean
          order_id: string
          product_id?: string | null
          product_name_ar: string
          product_name_en: string
          quantity: number
          unit_cost?: number
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          bundle_id?: string | null
          created_at?: string
          id?: string
          is_bundle_component?: boolean
          order_id?: string
          product_id?: string | null
          product_name_ar?: string
          product_name_en?: string
          quantity?: number
          unit_cost?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          area_id: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          coupon_applied: boolean
          coupon_code: string | null
          created_at: string
          created_by_admin_id: string | null
          customer_id: string | null
          delivered_at: string | null
          delivery_fee: number
          discount_amount: number
          full_address: string
          governorate_id: string | null
          guest_email: string | null
          guest_name: string | null
          guest_phone: string
          id: string
          idempotency_key: string | null
          internal_notes: string | null
          manual_customer_id: string | null
          notes: string | null
          order_number: string
          order_source: string
          order_type: Database["public"]["Enums"]["order_type"]
          status: Database["public"]["Enums"]["order_status"]
          stock_deducted: boolean
          subtotal: number
          total: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          coupon_applied?: boolean
          coupon_code?: string | null
          created_at?: string
          created_by_admin_id?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          delivery_fee?: number
          discount_amount?: number
          full_address: string
          governorate_id?: string | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone: string
          id?: string
          idempotency_key?: string | null
          internal_notes?: string | null
          manual_customer_id?: string | null
          notes?: string | null
          order_number: string
          order_source?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          status?: Database["public"]["Enums"]["order_status"]
          stock_deducted?: boolean
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          coupon_applied?: boolean
          coupon_code?: string | null
          created_at?: string
          created_by_admin_id?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          delivery_fee?: number
          discount_amount?: number
          full_address?: string
          governorate_id?: string | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string
          id?: string
          idempotency_key?: string | null
          internal_notes?: string | null
          manual_customer_id?: string | null
          notes?: string | null
          order_number?: string
          order_source?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          status?: Database["public"]["Enums"]["order_status"]
          stock_deducted?: boolean
          subtotal?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "delivery_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_created_by_admin_id_fkey"
            columns: ["created_by_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_manual_customer_id_fkey"
            columns: ["manual_customer_id"]
            isOneToOne: false
            referencedRelation: "manual_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          cancelled_at: string | null
          confirmed_by_admin_id: string | null
          created_at: string
          failed_at: string | null
          id: string
          method: string
          notes: string | null
          order_id: string
          paid_at: string | null
          provider_reference: string | null
          refunded_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          cancelled_at?: string | null
          confirmed_by_admin_id?: string | null
          created_at?: string
          failed_at?: string | null
          id?: string
          method?: string
          notes?: string | null
          order_id: string
          paid_at?: string | null
          provider_reference?: string | null
          refunded_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          cancelled_at?: string | null
          confirmed_by_admin_id?: string | null
          created_at?: string
          failed_at?: string | null
          id?: string
          method?: string
          notes?: string | null
          order_id?: string
          paid_at?: string | null
          provider_reference?: string | null
          refunded_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_confirmed_by_admin_id_fkey"
            columns: ["confirmed_by_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          period: string
          profile_id: string
          recorded_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          period: string
          profile_id: string
          recorded_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          period?: string
          profile_id?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_payments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
        ]
      }
      product_relations: {
        Row: {
          product_id: string
          related_product_id: string
          relation_type: string
        }
        Insert: {
          product_id: string
          related_product_id: string
          relation_type?: string
        }
        Update: {
          product_id?: string
          related_product_id?: string
          relation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_relations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_relations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_relations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_relations_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_relations_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_relations_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string | null
          guest_name: string | null
          id: string
          is_approved: boolean
          product_id: string
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          guest_name?: string | null
          id?: string
          is_approved?: boolean
          product_id: string
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          guest_name?: string | null
          id?: string
          is_approved?: boolean
          product_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          extra_price: number
          id: string
          name_ar: string
          name_en: string
          product_id: string
          sku: string | null
          stock_quantity: number
        }
        Insert: {
          created_at?: string
          extra_price?: number
          id?: string
          name_ar: string
          name_en: string
          product_id: string
          sku?: string | null
          stock_quantity?: number
        }
        Update: {
          created_at?: string
          extra_price?: number
          id?: string
          name_ar?: string
          name_en?: string
          product_id?: string
          sku?: string | null
          stock_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          color: string | null
          cost: number
          created_at: string
          description_ar: string | null
          description_en: string | null
          dimensions: string | null
          id: string
          is_published: boolean
          low_stock_threshold: number
          material: string | null
          min_wholesale_amount: number | null
          min_wholesale_qty: number | null
          name_ar: string
          name_en: string
          original_price: number | null
          package_contents_ar: string | null
          package_contents_en: string | null
          retail_price: number
          slug: string
          stock_quantity: number
          updated_at: string
          video_url: string | null
          wholesale_price: number | null
        }
        Insert: {
          category_id?: string | null
          color?: string | null
          cost?: number
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          dimensions?: string | null
          id?: string
          is_published?: boolean
          low_stock_threshold?: number
          material?: string | null
          min_wholesale_amount?: number | null
          min_wholesale_qty?: number | null
          name_ar?: string
          name_en?: string
          original_price?: number | null
          package_contents_ar?: string | null
          package_contents_en?: string | null
          retail_price?: number
          slug: string
          stock_quantity?: number
          updated_at?: string
          video_url?: string | null
          wholesale_price?: number | null
        }
        Update: {
          category_id?: string | null
          color?: string | null
          cost?: number
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          dimensions?: string | null
          id?: string
          is_published?: boolean
          low_stock_threshold?: number
          material?: string | null
          min_wholesale_amount?: number | null
          min_wholesale_qty?: number | null
          name_ar?: string
          name_en?: string
          original_price?: number | null
          package_contents_ar?: string | null
          package_contents_en?: string | null
          retail_price?: number
          slug?: string
          stock_quantity?: number
          updated_at?: string
          video_url?: string | null
          wholesale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          staff_role: Database["public"]["Enums"]["staff_role"]
          updated_at: string
          wholesale_status: Database["public"]["Enums"]["wholesale_status"]
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          staff_role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
          wholesale_status?: Database["public"]["Enums"]["wholesale_status"]
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          staff_role?: Database["public"]["Enums"]["staff_role"]
          updated_at?: string
          wholesale_status?: Database["public"]["Enums"]["wholesale_status"]
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          id: string
          product_id: string | null
          purchase_order_id: string
          quantity: number
          unit_cost: number
        }
        Insert: {
          id?: string
          product_id?: string | null
          purchase_order_id: string
          quantity: number
          unit_cost?: number
        }
        Update: {
          id?: string
          product_id?: string | null
          purchase_order_id?: string
          quantity?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          po_number: string
          received_at: string | null
          status: string
          supplier_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          po_number: string
          received_at?: string | null
          status?: string
          supplier_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          po_number?: string
          received_at?: string | null
          status?: string
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      recently_viewed: {
        Row: {
          product_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          product_id: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          product_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recently_viewed_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recently_viewed_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recently_viewed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          created_at: string
          id: string
          order_id: string
          reason: Database["public"]["Enums"]["return_reason"]
          reason_notes: string | null
          resolved_by_admin_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          reason: Database["public"]["Enums"]["return_reason"]
          reason_notes?: string | null
          resolved_by_admin_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          reason?: Database["public"]["Enums"]["return_reason"]
          reason_notes?: string | null
          resolved_by_admin_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_resolved_by_admin_id_fkey"
            columns: ["resolved_by_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value_ar: string | null
          value_en: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value_ar?: string | null
          value_en?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value_ar?: string | null
          value_en?: string | null
        }
        Relationships: []
      }
      staff_salaries: {
        Row: {
          monthly_salary: number
          notes: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          monthly_salary: number
          notes?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          monthly_salary?: number
          notes?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_salaries_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          facebook_url: string | null
          id: boolean
          instagram_url: string | null
          support_email: string | null
          support_phone: string | null
          tiktok_url: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          facebook_url?: string | null
          id?: boolean
          instagram_url?: string | null
          support_email?: string | null
          support_phone?: string | null
          tiktok_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          facebook_url?: string | null
          id?: boolean
          instagram_url?: string | null
          support_email?: string | null
          support_phone?: string | null
          tiktok_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      theme_settings: {
        Row: {
          accent_color: string
          id: boolean
          primary_color: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          id?: boolean
          primary_color?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          id?: boolean
          primary_color?: string
          updated_at?: string
        }
        Relationships: []
      }
      wholesale_applications: {
        Row: {
          address: string
          area_text: string | null
          commercial_document_path: string
          commercial_registration_number: string
          company_name: string
          created_at: string
          email: string | null
          full_name: string
          governorate_id: string | null
          id: string
          notes: string | null
          phone: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["wholesale_status"]
          user_id: string | null
        }
        Insert: {
          address: string
          area_text?: string | null
          commercial_document_path: string
          commercial_registration_number: string
          company_name: string
          created_at?: string
          email?: string | null
          full_name: string
          governorate_id?: string | null
          id?: string
          notes?: string | null
          phone: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["wholesale_status"]
          user_id?: string | null
        }
        Update: {
          address?: string
          area_text?: string | null
          commercial_document_path?: string
          commercial_registration_number?: string
          company_name?: string
          created_at?: string
          email?: string | null
          full_name?: string
          governorate_id?: string | null
          id?: string
          notes?: string | null
          phone?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["wholesale_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_applications_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesale_charges: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          description: string | null
          due_date: string
          id: string
          order_id: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          description?: string | null
          due_date: string
          id?: string
          order_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          description?: string | null
          due_date?: string
          id?: string
          order_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_charges_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_charges_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      wholesale_payments: {
        Row: {
          amount: number
          charge_id: string | null
          created_at: string
          customer_id: string
          id: string
          method: string | null
          notes: string | null
          payment_date: string
          recorded_by: string | null
        }
        Insert: {
          amount: number
          charge_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          method?: string | null
          notes?: string | null
          payment_date?: string
          recorded_by?: string | null
        }
        Update: {
          amount?: number
          charge_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          method?: string | null
          notes?: string | null
          payment_date?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_payments_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "wholesale_charges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist: {
        Row: {
          created_at: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      collections_storefront: {
        Row: {
          id: string | null
          image_url: string | null
          name_ar: string | null
          name_en: string | null
          placement: string | null
          product_id: string | null
          product_sort_order: number | null
          slug: string | null
          sort_order: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_storefront"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_wholesale"
            referencedColumns: ["id"]
          },
        ]
      }
      products_storefront: {
        Row: {
          category_id: string | null
          color: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          dimensions: string | null
          id: string | null
          material: string | null
          name_ar: string | null
          name_en: string | null
          original_price: number | null
          package_contents_ar: string | null
          package_contents_en: string | null
          retail_price: number | null
          slug: string | null
          stock_quantity: number | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          dimensions?: string | null
          id?: string | null
          material?: string | null
          name_ar?: string | null
          name_en?: string | null
          original_price?: number | null
          package_contents_ar?: string | null
          package_contents_en?: string | null
          retail_price?: number | null
          slug?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          dimensions?: string | null
          id?: string | null
          material?: string | null
          name_ar?: string | null
          name_en?: string | null
          original_price?: number | null
          package_contents_ar?: string | null
          package_contents_en?: string | null
          retail_price?: number | null
          slug?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products_wholesale: {
        Row: {
          category_id: string | null
          color: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          dimensions: string | null
          id: string | null
          material: string | null
          min_wholesale_amount: number | null
          min_wholesale_qty: number | null
          name_ar: string | null
          name_en: string | null
          package_contents_ar: string | null
          package_contents_en: string | null
          retail_price: number | null
          slug: string | null
          stock_quantity: number | null
          updated_at: string | null
          video_url: string | null
          wholesale_price: number | null
        }
        Insert: {
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          dimensions?: string | null
          id?: string | null
          material?: string | null
          min_wholesale_amount?: number | null
          min_wholesale_qty?: number | null
          name_ar?: string | null
          name_en?: string | null
          package_contents_ar?: string | null
          package_contents_en?: string | null
          retail_price?: number | null
          slug?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          video_url?: string | null
          wholesale_price?: number | null
        }
        Update: {
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          dimensions?: string | null
          id?: string | null
          material?: string | null
          min_wholesale_amount?: number | null
          min_wholesale_qty?: number | null
          name_ar?: string | null
          name_en?: string | null
          package_contents_ar?: string | null
          package_contents_en?: string | null
          retail_price?: number | null
          slug?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          video_url?: string | null
          wholesale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_has: { Args: { area: string }; Returns: boolean }
      create_order: {
        Args: {
          p_area_id: string
          p_coupon_code: string
          p_customer_id: string
          p_full_address: string
          p_governorate_id: string
          p_guest_email: string
          p_guest_name: string
          p_guest_phone: string
          p_idempotency_key?: string
          p_internal_notes?: string
          p_items: Json
          p_manual_customer_id?: string
          p_notes: string
          p_order_source?: string
          p_order_type: string
        }
        Returns: Json
      }
      is_admin: { Args: never; Returns: boolean }
      is_wholesale: { Args: never; Returns: boolean }
      log_activity: {
        Args: {
          p_action: string
          p_description: string
          p_entity_id: string
          p_entity_type: string
        }
        Returns: undefined
      }
      notify: {
        Args: {
          p_link: string
          p_message: string
          p_title: string
          p_type: string
        }
        Returns: undefined
      }
      redeem_coupon: {
        Args: { p_code: string; p_subtotal: number }
        Returns: Json
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "returned"
      order_type: "retail" | "wholesale"
      return_reason:
        | "changed_mind"
        | "differs_from_description"
        | "size_unsuitable"
        | "damaged"
        | "wrong_order"
        | "not_received"
        | "other"
      staff_role: "super_admin" | "manager" | "sales" | "warehouse"
      user_role: "admin" | "customer" | "wholesale_customer"
      wholesale_status: "none" | "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      order_type: ["retail", "wholesale"],
      return_reason: [
        "changed_mind",
        "differs_from_description",
        "size_unsuitable",
        "damaged",
        "wrong_order",
        "not_received",
        "other",
      ],
      staff_role: ["super_admin", "manager", "sales", "warehouse"],
      user_role: ["admin", "customer", "wholesale_customer"],
      wholesale_status: ["none", "pending", "approved", "rejected"],
    },
  },
} as const
