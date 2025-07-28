#!/usr/bin/env bash
set -euo pipefail

echo "=== NVIDIA Driver Install: START ==="

# 1) Update OS and install build tools & kernel modules
dnf update -y
dnf install -y \
    gcc \
    make \
    elfutils-libelf-devel \
    libglvnd-devel \
    kernel-devel-$(uname -r) \
    kernel-modules-extra

# 2) Add NVIDIA CUDA (RHEL9) repo, so we can install the driver via RPM
dnf config-manager --add-repo \
    https://developer.download.nvidia.com/compute/cuda/repos/rhel9/x86_64/cuda-rhel9.repo
dnf clean expire-cache

# 3) Install NVIDIA driver and GPU manager
dnf install -y \
    nvidia-driver \
    datacenter-gpu-manager

# 4) Load NVIDIA kernel modules immediately (no reboot)
modprobe nvidia

echo "=== NVIDIA Driver Install: COMPLETE ==="
