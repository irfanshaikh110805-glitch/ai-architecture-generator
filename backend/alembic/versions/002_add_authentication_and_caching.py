"""add authentication and caching

Revision ID: 002
Revises: 001
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('api_key', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('tier', sa.String(length=50), nullable=False, server_default='free'),
        sa.Column('daily_limit', sa.Integer(), nullable=False, server_default='5'),
        sa.Column('monthly_limit', sa.Integer(), nullable=False, server_default='100'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_api_key'), 'users', ['api_key'], unique=True)
    
    # Create architectures table
    op.create_table(
        'architectures',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('idea', sa.Text(), nullable=False),
        sa.Column('idea_hash', sa.String(length=64), nullable=False),
        sa.Column('architecture_type', sa.String(length=100), nullable=True),
        sa.Column('tech_stack_frontend', sa.String(length=255), nullable=True),
        sa.Column('tech_stack_backend', sa.String(length=255), nullable=True),
        sa.Column('tech_stack_database', sa.String(length=255), nullable=True),
        sa.Column('er_diagram', sa.Text(), nullable=True),
        sa.Column('architecture_diagram', sa.Text(), nullable=True),
        sa.Column('estimation_hours', sa.String(length=100), nullable=True),
        sa.Column('estimation_team_size', sa.String(length=100), nullable=True),
        sa.Column('estimation_cost', sa.String(length=255), nullable=True),
        sa.Column('is_fallback', sa.Boolean(), nullable=True, server_default='false'),
        sa.Column('fallback_message', sa.Text(), nullable=True),
        sa.Column('generation_time', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_architectures_id'), 'architectures', ['id'], unique=False)
    op.create_index(op.f('ix_architectures_user_id'), 'architectures', ['user_id'], unique=False)
    op.create_index(op.f('ix_architectures_idea_hash'), 'architectures', ['idea_hash'], unique=False)
    op.create_index('idx_user_created', 'architectures', ['user_id', 'created_at'], unique=False)
    
    # Create features table
    op.create_table(
        'features',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('architecture_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('priority', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True, server_default='0'),
        sa.ForeignKeyConstraint(['architecture_id'], ['architectures.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_features_id'), 'features', ['id'], unique=False)
    
    # Create database_tables table
    op.create_table(
        'database_tables',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('architecture_id', sa.Integer(), nullable=False),
        sa.Column('table_name', sa.String(length=255), nullable=False),
        sa.Column('fields', sa.Text(), nullable=False),
        sa.Column('relationships', sa.Text(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True, server_default='0'),
        sa.ForeignKeyConstraint(['architecture_id'], ['architectures.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_database_tables_id'), 'database_tables', ['id'], unique=False)
    
    # Create apis table
    op.create_table(
        'apis',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('architecture_id', sa.Integer(), nullable=False),
        sa.Column('method', sa.String(length=10), nullable=False),
        sa.Column('endpoint', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True, server_default='0'),
        sa.ForeignKeyConstraint(['architecture_id'], ['architectures.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_apis_id'), 'apis', ['id'], unique=False)
    
    # Create components table
    op.create_table(
        'components',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('architecture_id', sa.Integer(), nullable=False),
        sa.Column('component_name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True, server_default='0'),
        sa.ForeignKeyConstraint(['architecture_id'], ['architectures.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_components_id'), 'components', ['id'], unique=False)
    
    # Create roadmap_phases table
    op.create_table(
        'roadmap_phases',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('architecture_id', sa.Integer(), nullable=False),
        sa.Column('phase_name', sa.String(length=255), nullable=False),
        sa.Column('tasks', sa.Text(), nullable=False),
        sa.Column('order', sa.Integer(), nullable=True, server_default='0'),
        sa.ForeignKeyConstraint(['architecture_id'], ['architectures.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_roadmap_phases_id'), 'roadmap_phases', ['id'], unique=False)
    
    # Create usage_records table
    op.create_table(
        'usage_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('endpoint', sa.String(length=255), nullable=False),
        sa.Column('tokens_used', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('cost', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_usage_records_id'), 'usage_records', ['id'], unique=False)
    op.create_index(op.f('ix_usage_records_user_id'), 'usage_records', ['user_id'], unique=False)
    op.create_index('idx_user_date', 'usage_records', ['user_id', 'created_at'], unique=False)


def downgrade() -> None:
    op.drop_index('idx_user_date', table_name='usage_records')
    op.drop_index(op.f('ix_usage_records_user_id'), table_name='usage_records')
    op.drop_index(op.f('ix_usage_records_id'), table_name='usage_records')
    op.drop_table('usage_records')
    
    op.drop_index(op.f('ix_roadmap_phases_id'), table_name='roadmap_phases')
    op.drop_table('roadmap_phases')
    
    op.drop_index(op.f('ix_components_id'), table_name='components')
    op.drop_table('components')
    
    op.drop_index(op.f('ix_apis_id'), table_name='apis')
    op.drop_table('apis')
    
    op.drop_index(op.f('ix_database_tables_id'), table_name='database_tables')
    op.drop_table('database_tables')
    
    op.drop_index(op.f('ix_features_id'), table_name='features')
    op.drop_table('features')
    
    op.drop_index('idx_user_created', table_name='architectures')
    op.drop_index(op.f('ix_architectures_idea_hash'), table_name='architectures')
    op.drop_index(op.f('ix_architectures_user_id'), table_name='architectures')
    op.drop_index(op.f('ix_architectures_id'), table_name='architectures')
    op.drop_table('architectures')
    
    op.drop_index(op.f('ix_users_api_key'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
