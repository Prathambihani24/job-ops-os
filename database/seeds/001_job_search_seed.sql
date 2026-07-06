insert into companies (name, website, stage, score)
values
  ('SignalStack AI', 'https://signalstack.example', 'Series A', 91),
  ('Northwind Labs', 'https://northwind.example', 'Seed', 78)
on conflict do nothing;
