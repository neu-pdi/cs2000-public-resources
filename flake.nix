{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/25.05";
    systems.url = "github:nix-systems/default";
    pre-commit-hooks.url = "github:cachix/git-hooks.nix";
  };

  outputs =
    {
      self,
      nixpkgs,
      systems,
      pre-commit-hooks,
    }:
    let
      inherit (nixpkgs) lib legacyPackages;
      eachSystem = f: lib.genAttrs (import systems) (system: f legacyPackages.${system});
      hooks = {
        treefmt.enable = true;
      };
    in
    {
      checks = eachSystem (pkgs: {
        pre-commit-check = pre-commit-hooks.lib.${pkgs.system}.run {
          src = ./.;
          inherit hooks;
        };
      });

      devShells = eachSystem (pkgs: {
        default = pkgs.mkShell {
          inherit (self.checks.${pkgs.system}.pre-commit-check) shellHook;

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
