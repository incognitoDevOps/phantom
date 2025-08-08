export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      administrators: {
        Row: {
          created_at: string
          id: string
          login_name: string
          nick_name: string | null
          phone_number: string | null
          role: string
          serial_number: number | null
          state: string
        }
        Insert: {
          created_at?: string
          id?: string
          login_name: string
          nick_name?: string | null
          phone_number?: string | null
          role?: string
          serial_number?: number | null
          state?: string
        }
        Update: {
          created_at?: string
          id?: string
          login_name?: string
          nick_name?: string | null
          phone_number?: string | null
          role?: string
          serial_number?: number | null
          state?: string
        }
        Relationships: []
      }
      agents: {
        Row: {
          affiliate_links: string | null
          agent_id: number | null
          created_at: string
          id: string
          is_agent_administrator: boolean | null
          login_name: string
          nick_name: string | null
          phone_number: string | null
          promotional_code: string | null
          state: string | null
          superior_agent: string | null
        }
        Insert: {
          affiliate_links?: string | null
          agent_id?: number | null
          created_at?: string
          id?: string
          is_agent_administrator?: boolean | null
          login_name: string
          nick_name?: string | null
          phone_number?: string | null
          promotional_code?: string | null
          state?: string | null
          superior_agent?: string | null
        }
        Update: {
          affiliate_links?: string | null
          agent_id?: number | null
          created_at?: string
          id?: string
          is_agent_administrator?: boolean | null
          login_name?: string
          nick_name?: string | null
          phone_number?: string | null
          promotional_code?: string | null
          state?: string | null
          superior_agent?: string | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          category: string
          category_id: string | null
          confirm_button_name: string | null
          confirm_button_path: string | null
          content: string | null
          created_at: string
          creation_time: string
          id: string
          introduction: string | null
          link_address: string | null
          open_state: boolean
          operate: string | null
          picture: string | null
          release_time: string | null
          serial_number: number | null
          sorting: number
          title: string
        }
        Insert: {
          category: string
          category_id?: string | null
          confirm_button_name?: string | null
          confirm_button_path?: string | null
          content?: string | null
          created_at?: string
          creation_time?: string
          id?: string
          introduction?: string | null
          link_address?: string | null
          open_state?: boolean
          operate?: string | null
          picture?: string | null
          release_time?: string | null
          serial_number?: number | null
          sorting?: number
          title: string
        }
        Update: {
          category?: string
          category_id?: string | null
          confirm_button_name?: string | null
          confirm_button_path?: string | null
          content?: string | null
          created_at?: string
          creation_time?: string
          id?: string
          introduction?: string | null
          link_address?: string | null
          open_state?: boolean
          operate?: string | null
          picture?: string | null
          release_time?: string | null
          serial_number?: number | null
          sorting?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_records: {
        Row: {
          after_amount: number
          created_at: string
          id: string
          instructions: string | null
          operation_amount: number
          operation_time: string
          order_number: string
          previous_amount: number
          type: string
          user_id: string
          user_side_operation_instructions: string | null
          username: string
        }
        Insert: {
          after_amount?: number
          created_at?: string
          id?: string
          instructions?: string | null
          operation_amount?: number
          operation_time?: string
          order_number: string
          previous_amount?: number
          type: string
          user_id: string
          user_side_operation_instructions?: string | null
          username: string
        }
        Update: {
          after_amount?: number
          created_at?: string
          id?: string
          instructions?: string | null
          operation_amount?: number
          operation_time?: string
          order_number?: string
          previous_amount?: number
          type?: string
          user_id?: string
          user_side_operation_instructions?: string | null
          username?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          category_name: string
          classification_number: number | null
          created_at: string
          creation_time: string
          id: string
          open_state: boolean
        }
        Insert: {
          category_name: string
          classification_number?: number | null
          created_at?: string
          creation_time?: string
          id?: string
          open_state?: boolean
        }
        Update: {
          category_name?: string
          classification_number?: number | null
          created_at?: string
          creation_time?: string
          id?: string
          open_state?: boolean
        }
        Relationships: []
      }
      coupon_records: {
        Row: {
          coupon_code: string | null
          created_at: string
          distribution_time: string
          id: string
          special_offers: string | null
          update_time: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string
          distribution_time?: string
          id?: string
          special_offers?: string | null
          update_time?: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_code?: string | null
          created_at?: string
          distribution_time?: string
          id?: string
          special_offers?: string | null
          update_time?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          coupon_type: string
          created_at: string
          id: string
          issue_quantity: number | null
          name: string
          open_state: boolean
          sorting: number
          special_offers: string | null
          valid_days: number | null
        }
        Insert: {
          coupon_type: string
          created_at?: string
          id?: string
          issue_quantity?: number | null
          name: string
          open_state?: boolean
          sorting?: number
          special_offers?: string | null
          valid_days?: number | null
        }
        Update: {
          coupon_type?: string
          created_at?: string
          id?: string
          issue_quantity?: number | null
          name?: string
          open_state?: boolean
          sorting?: number
          special_offers?: string | null
          valid_days?: number | null
        }
        Relationships: []
      }
      customer_service: {
        Row: {
          created_at: string
          id: string
          open_state: boolean | null
          phone_number: string | null
          service_account: string | null
          service_hours: string | null
          service_link: string | null
          service_name: string
          service_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          open_state?: boolean | null
          phone_number?: string | null
          service_account?: string | null
          service_hours?: string | null
          service_link?: string | null
          service_name: string
          service_type: string
        }
        Update: {
          created_at?: string
          id?: string
          open_state?: boolean | null
          phone_number?: string | null
          service_account?: string | null
          service_hours?: string | null
          service_link?: string | null
          service_name?: string
          service_type?: string
        }
        Relationships: []
      }
      danger_value_records: {
        Row: {
          created_at: string
          id: string
          instructions: string | null
          operation_time: string
          serial_number: number | null
          type: string
          username: string
          value_at_risk: number
        }
        Insert: {
          created_at?: string
          id?: string
          instructions?: string | null
          operation_time?: string
          serial_number?: number | null
          type: string
          username: string
          value_at_risk?: number
        }
        Update: {
          created_at?: string
          id?: string
          instructions?: string | null
          operation_time?: string
          serial_number?: number | null
          type?: string
          username?: string
          value_at_risk?: number
        }
        Relationships: []
      }
      dictionary_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          dictionary_key: string
          dictionary_value: string
          display_name: string
          id: string
          is_active: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          dictionary_key: string
          dictionary_value: string
          display_name: string
          id?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          dictionary_key?: string
          dictionary_value?: string
          display_name?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      event_activities: {
        Row: {
          created_at: string
          creation_time: string
          id: string
          introduction: string | null
          link_address: string | null
          open_state: boolean
          picture: string | null
          serial_number: number | null
          sorting: number
          title: string
        }
        Insert: {
          created_at?: string
          creation_time?: string
          id?: string
          introduction?: string | null
          link_address?: string | null
          open_state?: boolean
          picture?: string | null
          serial_number?: number | null
          sorting?: number
          title: string
        }
        Update: {
          created_at?: string
          creation_time?: string
          id?: string
          introduction?: string | null
          link_address?: string | null
          open_state?: boolean
          picture?: string | null
          serial_number?: number | null
          sorting?: number
          title?: string
        }
        Relationships: []
      }
      financial_orders: {
        Row: {
          buy_time: string
          created_at: string
          current_income: number
          daily_income: number
          fees: number
          id: string
          order_number: string
          order_status: string
          product_name: string | null
          purchase_amount: number
          return_principal_and_interest: number
          revenue_time: number
          user_id: string
          username: string
          valid_days: number
        }
        Insert: {
          buy_time?: string
          created_at?: string
          current_income?: number
          daily_income?: number
          fees?: number
          id?: string
          order_number: string
          order_status?: string
          product_name?: string | null
          purchase_amount?: number
          return_principal_and_interest?: number
          revenue_time?: number
          user_id: string
          username: string
          valid_days?: number
        }
        Update: {
          buy_time?: string
          created_at?: string
          current_income?: number
          daily_income?: number
          fees?: number
          id?: string
          order_number?: string
          order_status?: string
          product_name?: string | null
          purchase_amount?: number
          return_principal_and_interest?: number
          revenue_time?: number
          user_id?: string
          username?: string
          valid_days?: number
        }
        Relationships: []
      }
      login_records: {
        Row: {
          created_at: string
          id: string
          login_address: string | null
          login_date: string
          login_ip: string | null
          serial_number: number | null
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          login_address?: string | null
          login_date?: string
          login_ip?: string | null
          serial_number?: number | null
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          login_address?: string | null
          login_date?: string
          login_ip?: string | null
          serial_number?: number | null
          username?: string
        }
        Relationships: []
      }
      lucky_wheel_activities: {
        Row: {
          created_at: string
          daily_draw_limit: number
          details: string
          free_draw_daily: boolean
          id: string
          is_active: boolean
          name: string
          total_draw_limit: number | null
        }
        Insert: {
          created_at?: string
          daily_draw_limit?: number
          details: string
          free_draw_daily?: boolean
          id?: string
          is_active?: boolean
          name: string
          total_draw_limit?: number | null
        }
        Update: {
          created_at?: string
          daily_draw_limit?: number
          details?: string
          free_draw_daily?: boolean
          id?: string
          is_active?: boolean
          name?: string
          total_draw_limit?: number | null
        }
        Relationships: []
      }
      navy_addresses: {
        Row: {
          consignee: string
          contact_number: string
          created_at: string
          creation_time: string
          delivery_address: string
          detailed_address: string | null
          id: string
          is_internal: boolean
          nation: string
          postal_code: string | null
          province_city_county: string | null
          user_type: string
        }
        Insert: {
          consignee: string
          contact_number: string
          created_at?: string
          creation_time?: string
          delivery_address: string
          detailed_address?: string | null
          id?: string
          is_internal?: boolean
          nation?: string
          postal_code?: string | null
          province_city_county?: string | null
          user_type?: string
        }
        Update: {
          consignee?: string
          contact_number?: string
          created_at?: string
          creation_time?: string
          delivery_address?: string
          detailed_address?: string | null
          id?: string
          is_internal?: boolean
          nation?: string
          postal_code?: string | null
          province_city_county?: string | null
          user_type?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          card_mode: string | null
          commission: number | null
          commission_rate: number | null
          created_at: string
          current_balance: number | null
          freeze_amount: number | null
          grab_info: Json | null
          id: string
          order_number: string
          product_id: string | null
          solution_group_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          card_mode?: string | null
          commission?: number | null
          commission_rate?: number | null
          created_at?: string
          current_balance?: number | null
          freeze_amount?: number | null
          grab_info?: Json | null
          id?: string
          order_number: string
          product_id?: string | null
          solution_group_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          card_mode?: string | null
          commission?: number | null
          commission_rate?: number | null
          created_at?: string
          current_balance?: number | null
          freeze_amount?: number | null
          grab_info?: Json | null
          id?: string
          order_number?: string
          product_id?: string | null
          solution_group_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_channels: {
        Row: {
          can_only_integers_be_entered: boolean
          channel_name: string
          created_at: string
          default_display_payment_amount: number
          exchange_rate: number
          id: string
          maximum_payment_amount: number
          merchant_name: string
          minimum_payment_amount: number
          open_state: boolean
          payment_amount_options: string | null
          payment_channels: string | null
          payment_methods: string | null
          rate_percentage: number
          sorting: number
        }
        Insert: {
          can_only_integers_be_entered?: boolean
          channel_name: string
          created_at?: string
          default_display_payment_amount?: number
          exchange_rate?: number
          id?: string
          maximum_payment_amount?: number
          merchant_name: string
          minimum_payment_amount?: number
          open_state?: boolean
          payment_amount_options?: string | null
          payment_channels?: string | null
          payment_methods?: string | null
          rate_percentage?: number
          sorting?: number
        }
        Update: {
          can_only_integers_be_entered?: boolean
          channel_name?: string
          created_at?: string
          default_display_payment_amount?: number
          exchange_rate?: number
          id?: string
          maximum_payment_amount?: number
          merchant_name?: string
          minimum_payment_amount?: number
          open_state?: boolean
          payment_amount_options?: string | null
          payment_channels?: string | null
          payment_methods?: string | null
          rate_percentage?: number
          sorting?: number
        }
        Relationships: []
      }
      payment_merchants: {
        Row: {
          api_interface_address: string | null
          backend_address: string | null
          created_at: string
          id: string
          merchant_account: string | null
          merchant_code: string
          merchant_name: string
          merchant_number: string | null
          open_state: boolean
          payment_merchant_number: string | null
        }
        Insert: {
          api_interface_address?: string | null
          backend_address?: string | null
          created_at?: string
          id?: string
          merchant_account?: string | null
          merchant_code: string
          merchant_name: string
          merchant_number?: string | null
          open_state?: boolean
          payment_merchant_number?: string | null
        }
        Update: {
          api_interface_address?: string | null
          backend_address?: string | null
          created_at?: string
          id?: string
          merchant_account?: string | null
          merchant_code?: string
          merchant_name?: string
          merchant_number?: string | null
          open_state?: boolean
          payment_merchant_number?: string | null
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          after_amount: number
          bank_account_number: string | null
          created_at: string
          id: string
          payment_amount: number
          payment_method: string | null
          payment_order_number: string
          payment_status: string
          previous_amount: number
          real_name: string | null
          submission_time: string
          update_time: string | null
          user_id: string
          user_type: string
          username: string
        }
        Insert: {
          after_amount?: number
          bank_account_number?: string | null
          created_at?: string
          id?: string
          payment_amount?: number
          payment_method?: string | null
          payment_order_number: string
          payment_status?: string
          previous_amount?: number
          real_name?: string | null
          submission_time?: string
          update_time?: string | null
          user_id: string
          user_type?: string
          username: string
        }
        Update: {
          after_amount?: number
          bank_account_number?: string | null
          created_at?: string
          id?: string
          payment_amount?: number
          payment_method?: string | null
          payment_order_number?: string
          payment_status?: string
          previous_amount?: number
          real_name?: string | null
          submission_time?: string
          update_time?: string | null
          user_id?: string
          user_type?: string
          username?: string
        }
        Relationships: []
      }
      payout_channels: {
        Row: {
          channel_name: string
          created_at: string
          default_display_payment_amount: number
          exchange_rate: number
          id: string
          maximum_payment_amount: number
          merchant_name: string
          minimum_payment_amount: number
          open_state: boolean
          payment_amount_options: string | null
          payment_channel_account: string | null
          payment_methods: string | null
          rate_percentage: number
          sorting: number
        }
        Insert: {
          channel_name: string
          created_at?: string
          default_display_payment_amount?: number
          exchange_rate?: number
          id?: string
          maximum_payment_amount?: number
          merchant_name: string
          minimum_payment_amount?: number
          open_state?: boolean
          payment_amount_options?: string | null
          payment_channel_account?: string | null
          payment_methods?: string | null
          rate_percentage?: number
          sorting?: number
        }
        Update: {
          channel_name?: string
          created_at?: string
          default_display_payment_amount?: number
          exchange_rate?: number
          id?: string
          maximum_payment_amount?: number
          merchant_name?: string
          minimum_payment_amount?: number
          open_state?: boolean
          payment_amount_options?: string | null
          payment_channel_account?: string | null
          payment_methods?: string | null
          rate_percentage?: number
          sorting?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          code: string
          created_at: string
          id: string
          image_url: string | null
          is_open: boolean | null
          name: string
          price: number
          sorting: number | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_open?: boolean | null
          name: string
          price: number
          sorting?: number | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_open?: boolean | null
          name?: string
          price?: number
          sorting?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number | null
          created_at: string | null
          email: string | null
          grade: string | null
          id: string
          invitation_code: string | null
          is_member_agent: boolean | null
          last_login_time: string | null
          login_address: string | null
          login_ip: string | null
          login_status: string | null
          phone_number: string | null
          platform_agent: string | null
          remark: string | null
          telegram: string | null
          updated_at: string | null
          username: string | null
          whatsapp: string | null
          withdrawal_password: string | null
          withdrawal_status: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          email?: string | null
          grade?: string | null
          id: string
          invitation_code?: string | null
          is_member_agent?: boolean | null
          last_login_time?: string | null
          login_address?: string | null
          login_ip?: string | null
          login_status?: string | null
          phone_number?: string | null
          platform_agent?: string | null
          remark?: string | null
          telegram?: string | null
          updated_at?: string | null
          username?: string | null
          whatsapp?: string | null
          withdrawal_password?: string | null
          withdrawal_status?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          email?: string | null
          grade?: string | null
          id?: string
          invitation_code?: string | null
          is_member_agent?: boolean | null
          last_login_time?: string | null
          login_address?: string | null
          login_ip?: string | null
          login_status?: string | null
          phone_number?: string | null
          platform_agent?: string | null
          remark?: string | null
          telegram?: string | null
          updated_at?: string | null
          username?: string | null
          whatsapp?: string | null
          withdrawal_password?: string | null
          withdrawal_status?: string | null
        }
        Relationships: []
      }
      recharge_records: {
        Row: {
          created_at: string
          id: string
          merchant_order_number: string
          payment_information: Json | null
          payment_methods: string
          recharge_amount: number
          recharge_status: string
          recharge_time: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          merchant_order_number: string
          payment_information?: Json | null
          payment_methods?: string
          recharge_amount?: number
          recharge_status?: string
          recharge_time?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          merchant_order_number?: string
          payment_information?: Json | null
          payment_methods?: string
          recharge_amount?: number
          recharge_status?: string
          recharge_time?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          id: string
          open_state: boolean
          role_name: string
          serial_number: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          open_state?: boolean
          role_name: string
          serial_number?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          open_state?: boolean
          role_name?: string
          serial_number?: number | null
        }
        Relationships: []
      }
      solution_groups: {
        Row: {
          agent_name: string | null
          associated_users: number
          created_at: string
          id: string
          is_default: boolean
          is_team_mode: boolean
          name: string
          number_of_orders: number
          open_state: boolean
          program_plan: string | null
          serial_number: number | null
          share: number
        }
        Insert: {
          agent_name?: string | null
          associated_users?: number
          created_at?: string
          id?: string
          is_default?: boolean
          is_team_mode?: boolean
          name: string
          number_of_orders?: number
          open_state?: boolean
          program_plan?: string | null
          serial_number?: number | null
          share?: number
        }
        Update: {
          agent_name?: string | null
          associated_users?: number
          created_at?: string
          id?: string
          is_default?: boolean
          is_team_mode?: boolean
          name?: string
          number_of_orders?: number
          open_state?: boolean
          program_plan?: string | null
          serial_number?: number | null
          share?: number
        }
        Relationships: []
      }
      statistics_summary: {
        Row: {
          backstage_recharge_amount: number | null
          backstage_recharge_people: number | null
          backstage_recharge_times: number | null
          created_at: string | null
          credit_amount: number | null
          credit_people: number | null
          credit_times: number | null
          current_online: number | null
          date: string | null
          first_charge_vip: number | null
          first_deposit_total: number | null
          handling_fee: number | null
          id: string
          new_registrants: number | null
          online_recharge_amount: number | null
          online_recharge_people: number | null
          online_recharge_times: number | null
          second_charge_total: number | null
          total_member_balance: number | null
          total_members: number | null
        }
        Insert: {
          backstage_recharge_amount?: number | null
          backstage_recharge_people?: number | null
          backstage_recharge_times?: number | null
          created_at?: string | null
          credit_amount?: number | null
          credit_people?: number | null
          credit_times?: number | null
          current_online?: number | null
          date?: string | null
          first_charge_vip?: number | null
          first_deposit_total?: number | null
          handling_fee?: number | null
          id?: string
          new_registrants?: number | null
          online_recharge_amount?: number | null
          online_recharge_people?: number | null
          online_recharge_times?: number | null
          second_charge_total?: number | null
          total_member_balance?: number | null
          total_members?: number | null
        }
        Update: {
          backstage_recharge_amount?: number | null
          backstage_recharge_people?: number | null
          backstage_recharge_times?: number | null
          created_at?: string | null
          credit_amount?: number | null
          credit_people?: number | null
          credit_times?: number | null
          current_online?: number | null
          date?: string | null
          first_charge_vip?: number | null
          first_deposit_total?: number | null
          handling_fee?: number | null
          id?: string
          new_registrants?: number | null
          online_recharge_amount?: number | null
          online_recharge_people?: number | null
          online_recharge_times?: number | null
          second_charge_total?: number | null
          total_member_balance?: number | null
          total_members?: number | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          setting_key: string
          setting_type: string
          setting_value: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          setting_key: string
          setting_type?: string
          setting_value?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          setting_key?: string
          setting_type?: string
          setting_value?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          number_of_orders: number
          open_state: boolean | null
          reward_amount: number
          sorting: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          number_of_orders: number
          open_state?: boolean | null
          reward_amount: number
          sorting?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          number_of_orders?: number
          open_state?: boolean | null
          reward_amount?: number
          sorting?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      todo_lists: {
        Row: {
          agent_review_status: string | null
          amount_of_payment: number | null
          application_amount: number | null
          balance: number | null
          created_at: string | null
          id: string
          name: string | null
          operator: string | null
          phone_number: string | null
          user_id: string
          user_type: string | null
          username: string
          withdrawal_account_info: string | null
          withdrawal_order_number: string | null
          withdrawal_time: string | null
        }
        Insert: {
          agent_review_status?: string | null
          amount_of_payment?: number | null
          application_amount?: number | null
          balance?: number | null
          created_at?: string | null
          id?: string
          name?: string | null
          operator?: string | null
          phone_number?: string | null
          user_id: string
          user_type?: string | null
          username: string
          withdrawal_account_info?: string | null
          withdrawal_order_number?: string | null
          withdrawal_time?: string | null
        }
        Update: {
          agent_review_status?: string | null
          amount_of_payment?: number | null
          application_amount?: number | null
          balance?: number | null
          created_at?: string | null
          id?: string
          name?: string | null
          operator?: string | null
          phone_number?: string | null
          user_id?: string
          user_type?: string | null
          username?: string
          withdrawal_account_info?: string | null
          withdrawal_order_number?: string | null
          withdrawal_time?: string | null
        }
        Relationships: []
      }
      user_levels: {
        Row: {
          created_at: string
          display_status: boolean
          icon_url: string | null
          id: string
          level_value: number
          name: string
          open_state: boolean
          order_grabbing_restrictions: string | null
          purchase_balance_limit: string | null
          serial_number: number | null
          sorting: number
          upgrade_price: number
          withdrawal_restrictions: string | null
        }
        Insert: {
          created_at?: string
          display_status?: boolean
          icon_url?: string | null
          id?: string
          level_value?: number
          name: string
          open_state?: boolean
          order_grabbing_restrictions?: string | null
          purchase_balance_limit?: string | null
          serial_number?: number | null
          sorting?: number
          upgrade_price?: number
          withdrawal_restrictions?: string | null
        }
        Update: {
          created_at?: string
          display_status?: boolean
          icon_url?: string | null
          id?: string
          level_value?: number
          name?: string
          open_state?: boolean
          order_grabbing_restrictions?: string | null
          purchase_balance_limit?: string | null
          serial_number?: number | null
          sorting?: number
          upgrade_price?: number
          withdrawal_restrictions?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          agent_id: string | null
          balance: number | null
          created_at: string
          email: string
          first_deposit_total: number | null
          id: string
          is_online: boolean | null
          password_hash: string
          phone_number: string | null
          second_charge_total: number | null
          updated_at: string
          user_type: string | null
          username: string
        }
        Insert: {
          agent_id?: string | null
          balance?: number | null
          created_at?: string
          email: string
          first_deposit_total?: number | null
          id?: string
          is_online?: boolean | null
          password_hash: string
          phone_number?: string | null
          second_charge_total?: number | null
          updated_at?: string
          user_type?: string | null
          username: string
        }
        Update: {
          agent_id?: string | null
          balance?: number | null
          created_at?: string
          email?: string
          first_deposit_total?: number | null
          id?: string
          is_online?: boolean | null
          password_hash?: string
          phone_number?: string | null
          second_charge_total?: number | null
          updated_at?: string
          user_type?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wheel_draw_records: {
        Row: {
          activity_id: string | null
          activity_name: string | null
          created_at: string | null
          draw_time: string
          id: string
          order_number: string
          payment_amount: number | null
          prize_name: string | null
          user_id: string | null
          username: string
          winning_amount: number | null
          winning_info: string | null
        }
        Insert: {
          activity_id?: string | null
          activity_name?: string | null
          created_at?: string | null
          draw_time?: string
          id?: string
          order_number: string
          payment_amount?: number | null
          prize_name?: string | null
          user_id?: string | null
          username: string
          winning_amount?: number | null
          winning_info?: string | null
        }
        Update: {
          activity_id?: string | null
          activity_name?: string | null
          created_at?: string | null
          draw_time?: string
          id?: string
          order_number?: string
          payment_amount?: number | null
          prize_name?: string | null
          user_id?: string | null
          username?: string
          winning_amount?: number | null
          winning_info?: string | null
        }
        Relationships: []
      }
      withdrawal_records: {
        Row: {
          agent_review_status: string
          amount_of_payment: number
          application_amount: number
          balance: number
          created_at: string
          id: string
          operator: string | null
          payment_method: string | null
          state: string
          update_time: string | null
          user_id: string
          username: string
          withdrawal_account_info: Json | null
          withdrawal_order_number: string
          withdrawal_time: string
        }
        Insert: {
          agent_review_status?: string
          amount_of_payment?: number
          application_amount?: number
          balance?: number
          created_at?: string
          id?: string
          operator?: string | null
          payment_method?: string | null
          state?: string
          update_time?: string | null
          user_id: string
          username: string
          withdrawal_account_info?: Json | null
          withdrawal_order_number: string
          withdrawal_time?: string
        }
        Update: {
          agent_review_status?: string
          amount_of_payment?: number
          application_amount?: number
          balance?: number
          created_at?: string
          id?: string
          operator?: string | null
          payment_method?: string | null
          state?: string
          update_time?: string | null
          user_id?: string
          username?: string
          withdrawal_account_info?: Json | null
          withdrawal_order_number?: string
          withdrawal_time?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}