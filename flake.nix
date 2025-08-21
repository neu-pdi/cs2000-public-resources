{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/25.05";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    {
      self,
      nixpkgs,
      systems,
    }:
    let
      inherit (nixpkgs) lib legacyPackages;
      eachSystem = f: lib.genAttrs (import systems) (system: f legacyPackages.${system});
    in
    {
      devShells = eachSystem (pkgs: {
        default = pkgs.mkShell {
          packages =
            [ ]
            ++ (with pkgs; [
              nodejs_24
              treefmt
            ])
            ++ (with pkgs.python313Packages; [
              mdformat
              mdformat-gfm
              mdformat-frontmatter
              mdformat-admon
            ]);
        };
      });
    };
}
