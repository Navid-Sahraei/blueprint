/** Re-mounts on every /app navigation so content cross-fades in. */
export default function AppTemplate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="route-fade">{children}</div>;
}
