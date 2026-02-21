export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} PlacementPro. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70 text-center md:text-right">
            Placement assistance portal. Final placement decisions rest with the institution.
          </p>
        </div>
      </div>
    </footer>
  );
}
