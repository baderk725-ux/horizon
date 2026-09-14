-- orders_insert_anyone / order_items_insert_anyone allowed ANY client
-- (including anonymous) to INSERT directly into orders/order_items via
-- PostgREST, bypassing create_order() entirely: fabricated totals,
-- status='delivered' from creation, and customer_id set to any real
-- user's id (impersonation / order-history pollution) were all possible
-- and verified live. create_order() is SECURITY DEFINER owned by
-- `postgres`, which has BYPASSRLS -- its internal inserts already ignore
-- RLS regardless of these policies, and no application code performs a
-- direct .insert() on either table (create_order is the only
-- order-creation path). So the permissive policies served no legitimate
-- purpose. Dropping them makes INSERT deny-by-default for both tables
-- (RLS remains enabled), which does not affect create_order in any way.

drop policy if exists orders_insert_anyone on public.orders;
drop policy if exists order_items_insert_anyone on public.order_items;
