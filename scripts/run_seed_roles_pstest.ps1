#run this in terminal from project root when trying to test with seed_roles.py

#.\scripts\run_seed_roles_pstest.ps1

$env:PYTHONPATH = "$PSScriptRoot\.."
python "$PSScriptRoot\seed_roles.py"